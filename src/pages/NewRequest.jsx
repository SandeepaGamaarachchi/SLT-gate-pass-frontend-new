import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SenderDetails from "./SenderDetails";

const NewRequest = () => {
  // State declarations
  const [senderDetails, setSenderDetails] = useState({
    sender_name: "",  
    designation: "",
    service_no: "",
    section: "",
    group_number: "",
    contact_number: "",
  });

  const [items, setItems] = useState([{
    itemName: "",
    serialNo: "",
    category: "",
    description: "",
    returnable: "",
    image: null,
    quantity: ""
  }]);

  const [commonData, setCommonData] = useState({
    inLocation: "",
    outLocation: "",
    executiveOfficer: "",
    receiverAvailable: false,
    receiverName: "",
    receiverContact: "",
    receiverGroup: "",
    receiverServiceNumber: "",
    vehicleNumber: "",
    byHand: ""
  });

  const [error, setError] = useState("");
  const [csvFileName, setCsvFileName] = useState("");
  const [isCSVUploaded, setIsCSVUploaded] = useState(false);
  const navigate = useNavigate();

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate byHand and vehicleNumber
    if (commonData.byHand === "No" && !commonData.vehicleNumber.trim()) {
      setError("Vehicle number is required when not delivering by hand");
      return;
    }
    
    if (commonData.byHand === "Yes" && commonData.vehicleNumber.trim()) {
      setError("Vehicle number should be empty when delivering by hand");
      return;
    }

    try {
      const formDataToSend = new FormData();

      // Add sender details
      Object.keys(senderDetails).forEach(key => {
        formDataToSend.append(key, senderDetails[key]);
      });

      // Add common data
      Object.keys(commonData).forEach(key => {
        if (!commonData.receiverAvailable && 
            ['receiverName', 'receiverContact', 'receiverGroup', 'receiverServiceNumber'].includes(key)) {
          return;
        }
        formDataToSend.append(key, commonData[key]);
      });

      // Add items with their images
      items.forEach((item, index) => {
        Object.keys(item).forEach(key => {
          if (key !== 'image' && item[key] !== null) {
            formDataToSend.append(`items[${index}][${key}]`, item[key]);
          } else if (key === 'image' && item[key]) {
            formDataToSend.append(`items[${index}][image]`, item[key]);
          }
        });
      });

      await axios.post("http://localhost:5000/api/requests/create", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      navigate("/my-request");
    } catch (error) {
      setError("Failed to create request. Please try again.");
      console.error("Error creating request:", error);
    }
  };

  // Common form field handler
  const handleCommonChange = (e) => {
    const { name, value } = e.target;
    setCommonData({
      ...commonData,
      [name]: value
    });
  };

  // Item field handlers
  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const newItems = [...items];
    newItems[index] = {
      ...newItems[index],
      [name]: value
    };
    setItems(newItems);
  };

  const handleItemImageChange = (index, e) => {
    const newItems = [...items];
    newItems[index] = {
      ...newItems[index],
      image: e.target.files[0]
    };
    setItems(newItems);
  };

  // Item management
  const addItem = () => {
    setItems([
      ...items,
      {
        itemName: "",
        serialNo: "",
        category: "",
        description: "",
        returnable: "",
        image: null,
        quantity: ""
      }
    ]);
  };

  const removeItem = (index) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  // CSV import handler
  const handleCSVImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setCsvFileName(file.name);
    setError("");
    setIsCSVUploaded(false);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const csvData = event.target.result;
        const lines = csvData.split('\n').filter(line => line.trim() !== '');
        
        if (lines.length < 2) {
          setError("CSV file is empty or has no data rows");
          return;
        }

        const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
        const newItems = [];

        for (let i = 1; i < lines.length; i++) {
          const currentLine = lines[i].split(',');
          const item = {};

          headers.forEach((header, index) => {
            const value = currentLine[index] ? currentLine[index].trim() : '';
            
            switch(header) {
              case 'itemname':
              case 'item name':
                item.itemName = value;
                break;
              case 'serialno':
              case 'serial no':
                item.serialNo = value;
                break;
              case 'category':
                item.category = value;
                break;
              case 'quantity':
                item.quantity = isNaN(parseInt(value)) ? 1 : parseInt(value);
                break;
              case 'description':
                item.description = value;
                break;
              case 'returnable':
                item.returnable = value.toLowerCase() === 'yes' ? 'yes' : 'no';
                break;
            }
          });

          if (!item.itemName) continue;
          newItems.push({
            itemName: item.itemName || '',
            serialNo: item.serialNo || '',
            category: item.category || '',
            description: item.description || '',
            returnable: item.returnable || 'no',
            quantity: item.quantity || 1,
            image: null
          });
        }

        if (newItems.length > 0) {
          setItems(newItems);
          setIsCSVUploaded(true);
        } else {
          setError("No valid items found in CSV");
        }
      } catch (err) {
        setError("Error processing CSV file. Please check the format.");
        console.error("CSV processing error:", err);
      }
    };
    reader.readAsText(file);
  };

  // Function to download CSV template
  const downloadCSVTemplate = () => {
    const csvContent = "data:text/csv;charset=utf-8," +
      "itemName,serialNo,category,quantity,description,returnable\n" +
      "Sample Item,S12345,Electronics,1,This is a sample item,yes\n" +
      "Another Item,7890,Stationery,2,Another sample item,no";
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "items_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto p-4">
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {isCSVUploaded && (
          <div className="mb-4 p-3 bg-blue-100 text-blue-800 rounded-md">
            CSV items loaded successfully. Please review and complete all required fields.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto bg-white border-2 border-blue-200 p-6 rounded-lg">
          {/* Sender Details Section */}
          <SenderDetails 
            onSenderDetailsChange={(details) => setSenderDetails(details)}
          />
          
          {/* CSV Import Section */}
          <div className="mb-6 border-2 border-blue-400 p-4 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Import Items from CSV (Optional)</h3>
            <div className="flex items-center space-x-4">
              <input
                type="file"
                id="csvImport"
                accept=".csv"
                onChange={handleCSVImport}
                className="hidden"
              />
              <label
                htmlFor="csvImport"
                className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 cursor-pointer"
              >
                Choose Items CSV File
                
              </label>
              <button
                type="button"
                onClick={downloadCSVTemplate}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                Download Items CSV Template
              </button>
              <span className="text-gray-700">{csvFileName || 'No file chosen'}</span>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              CSV should contain: itemName, serialNo, category, quantity, description, returnable
            </p>
          </div>

          {/* Items List */}
          {items.map((item, index) => (
            <div key={index} className="mb-6 border-2 border-blue-400 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Item {index + 1} Details</h3>
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                  >
                    Remove
                  </button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor={`itemName-${index}`} className="block text-sm font-medium text-gray-700">
                    Item Name
                  </label>
                  <input
                    type="text"
                    name="itemName"
                    id={`itemName-${index}`}
                    value={item.itemName}
                    onChange={(e) => handleItemChange(index, e)}
                    className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                    required
                  />
                </div>

                <div>
                  <label htmlFor={`serialNo-${index}`} className="block text-sm font-medium text-gray-700">
                    Serial No
                  </label>
                  <input
                    type="text"
                    name="serialNo"
                    id={`serialNo-${index}`}
                    value={item.serialNo}
                    onChange={(e) => handleItemChange(index, e)}
                    className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                    required
                  />
                </div>

                <div>
                  <label htmlFor={`category-${index}`} className="block text-sm font-medium text-gray-700">
                    Category
                  </label>
                  <input
                    type="text"
                    name="category"
                    id={`category-${index}`}
                    value={item.category}
                    onChange={(e) => handleItemChange(index, e)}
                    className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                    required
                  />
                </div>

                <div>
                  <label htmlFor={`quantity-${index}`} className="block text-sm font-medium text-gray-700">
                    Quantity
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    id={`quantity-${index}`}
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, e)}
                    className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                    required
                    min="1"
                  />
                </div>

                <div>
                  <label htmlFor={`description-${index}`} className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    name="description"
                    id={`description-${index}`}
                    value={item.description}
                    onChange={(e) => handleItemChange(index, e)}
                    className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Returnable</label>
                  <div className="mt-1 flex items-center space-x-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="returnable"
                        value="yes"
                        checked={item.returnable === "yes"}
                        onChange={(e) => handleItemChange(index, e)}
                        className="h-4 w-4 text-blue-600 border-gray-300"
                      />
                      <span className="ml-2 text-gray-700">Yes</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="returnable"
                        value="no"
                        checked={item.returnable === "no"}
                        onChange={(e) => handleItemChange(index, e)}
                        className="h-4 w-4 text-blue-600 border-gray-300"
                      />
                      <span className="ml-2 text-gray-700">No</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label htmlFor={`image-${index}`} className="block text-sm font-medium text-gray-700">
                    Upload Image (Optional)
                  </label>
                  <input
                    type="file"
                    name="image"
                    id={`image-${index}`}
                    accept="image/*"
                    onChange={(e) => handleItemImageChange(index, e)}
                    className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                  />
                </div>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addItem}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 mb-6"
          >
            Add Another Item
          </button>

          {/* Request Details Section */}
          <div className="mb-6 border-2 border-blue-400 p-4 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Request Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="inLocation" className="block text-sm font-medium text-gray-700">
                  In Location
                </label>
                <select
                  name="inLocation"
                  id="inLocation"
                  value={commonData.inLocation}
                  onChange={handleCommonChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                  required
                >
                  <option value="">Select In Location</option>
                  <option value="Gampaha Office">Gampaha Office</option>
                  <option value="Kandy Office">Kandy Office</option>
                  <option value="Matara Office">Matara Office</option>
                </select>
              </div>

              <div>
                <label htmlFor="outLocation" className="block text-sm font-medium text-gray-700">
                  Out Location
                </label>
                <select
                  name="outLocation"
                  id="outLocation"
                  value={commonData.outLocation}
                  onChange={handleCommonChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                  required
                >
                  <option value="">Select Out Location</option>
                  <option value="Colombo Office">Colombo Office</option>
                  <option value="Galle Office">Galle Office</option>
                  <option value="Kurunegala Office">Kurunegala Office</option>
                </select>
              </div>

              <div>
                <label htmlFor="executiveOfficer" className="block text-sm font-medium text-gray-700">
                  Executive Officer
                </label>
                <select
                  name="executiveOfficer"
                  id="executiveOfficer"
                  value={commonData.executiveOfficer}
                  onChange={handleCommonChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                  required
                >
                  <option value="">Select Executive Officer</option>
                  <option value="Kasun Gunawardhane">Mr. Gunawardana</option>
                  <option value="Mr. Perera">Mr. Perera</option>
                  <option value="Ms. Silva">Ms. Silva</option>
                </select>
              </div>

              <div>
                <label htmlFor="byHand" className="block text-sm font-medium text-gray-700">
                  By Hand
                </label>
                <select
                  name="byHand"
                  id="byHand"
                  value={commonData.byHand}
                  onChange={handleCommonChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                  required
                >
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>

              {commonData.byHand === "No" && (
                <div>
                  <label htmlFor="vehicleNumber" className="block text-sm font-medium text-gray-700">
                    Vehicle Number
                  </label>
                  <input
                    type="text"
                    name="vehicleNumber"
                    id="vehicleNumber"
                    value={commonData.vehicleNumber}
                    onChange={handleCommonChange}
                    className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                    required={commonData.byHand === "No"}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Receiver Available Section */}
          <div className="mb-6 border-2 border-blue-400 p-4 rounded-lg">
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="receiverAvailable"
                name="receiverAvailable"
                checked={commonData.receiverAvailable}
                onChange={(e) => {
                  setCommonData({
                    ...commonData,
                    receiverAvailable: e.target.checked,
                    ...(!e.target.checked && {
                      receiverName: "",
                      receiverContact: "",
                      receiverGroup: "",
                      receiverServiceNumber: ""
                    })
                  });
                }}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <label htmlFor="receiverAvailable" className="ml-2 text-lg font-medium text-gray-700">
                Receiver Available
              </label>
            </div>

            {commonData.receiverAvailable && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="receiverServiceNumber" className="block text-sm font-medium text-gray-700">
                      Receiver Service Number
                    </label>
                    <input
                      type="text"
                      name="receiverServiceNumber"
                      id="receiverServiceNumber"
                      value={commonData.receiverServiceNumber}
                      onChange={async (e) => {
                        const serviceNo = e.target.value;
                        setCommonData({
                          ...commonData,
                          receiverServiceNumber: serviceNo
                        });
                        
                        if (serviceNo) {
                          try {
                            const response = await axios.get(`http://localhost:5000/api/auth/by-service/${serviceNo}`);
                            const user = response.data;
                            if (user) {
                              setCommonData(prev => ({
                                ...prev,
                                receiverName: user.sender_name,
                                receiverContact: user.contact_number,
                                receiverGroup: user.group_number
                              }));
                            }
                          } catch (error) {
                            console.error("Error fetching receiver details:", error);
                          }
                        }
                      }}
                      className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="receiverName" className="block text-sm font-medium text-gray-700">
                      Receiver Name
                    </label>
                    <input
                      type="text"
                      name="receiverName"
                      id="receiverName"
                      value={commonData.receiverName}
                      onChange={handleCommonChange}
                      className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="receiverContact" className="block text-sm font-medium text-gray-700">
                      Contact No
                    </label>
                    <input
                      type="text"
                      name="receiverContact"
                      id="receiverContact"
                      value={commonData.receiverContact}
                      onChange={handleCommonChange}
                      className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="receiverGroup" className="block text-sm font-medium text-gray-700">
                      Group
                    </label>
                    <input
                      type="text"
                      name="receiverGroup"
                      id="receiverGroup"
                      value={commonData.receiverGroup}
                      onChange={handleCommonChange}
                      className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          <button type="submit" className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Submit Request
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewRequest;