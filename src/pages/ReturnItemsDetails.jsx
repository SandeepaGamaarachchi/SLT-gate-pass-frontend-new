import React, { useState } from 'react';
import axios from 'axios';

const ReturnItemsDetails = () => {
  const [items, setItems] = useState([{ 
    name: '', 
    serialNo: '', 
    quantity: '',
    condition: 'good',
    returnReason: ''
  }]);
  const [processedBy, setProcessedBy] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const newItems = [...items];
    newItems[index][name] = value;
    setItems(newItems);
  };

  const addItemRow = () => {
    setItems([...items, { 
      name: '', 
      serialNo: '', 
      quantity: '',
      condition: 'good',
      returnReason: ''
    }]);
  };

  const removeItemRow = (index) => {
    if (items.length > 1) {
      const newItems = [...items];
      newItems.splice(index, 1);
      setItems(newItems);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const payload = {
        items,
        processedBy,
        returnDate,
        timestamp: new Date().toISOString()
      };

      // Replace with your actual API endpoint
      const response = await axios.post('/api/return-items', payload);

      if (response.status === 201) {
        setSuccessMessage('Return items processed successfully!');
        // Reset form
        setItems([{ name: '', serialNo: '', quantity: '', condition: 'good', returnReason: '' }]);
        setProcessedBy('');
        setReturnDate('');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrorMessage(error.response?.data?.message || 'Failed to process return. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Return Items Processing</h1>
      
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {successMessage}
        </div>
      )}
      
      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="processedBy">
              Processed By (Staff Name)
            </label>
            <input
              type="text"
              id="processedBy"
              value={processedBy}
              onChange={(e) => setProcessedBy(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="returnDate">
              Return Date
            </label>
            <input
              type="date"
              id="returnDate"
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Return Items Details</h2>
            <button
              type="button"
              onClick={addItemRow}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-sm flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Item
            </button>
          </div>
          
          {items.map((item, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4 relative">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={`name-${index}`}>
                    Item Name
                  </label>
                  <input
                    type="text"
                    id={`name-${index}`}
                    name="name"
                    value={item.name}
                    onChange={(e) => handleItemChange(index, e)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={`serialNo-${index}`}>
                    Serial/Asset Number
                  </label>
                  <input
                    type="text"
                    id={`serialNo-${index}`}
                    name="serialNo"
                    value={item.serialNo}
                    onChange={(e) => handleItemChange(index, e)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={`quantity-${index}`}>
                    Quantity
                  </label>
                  <input
                    type="number"
                    id={`quantity-${index}`}
                    name="quantity"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, e)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    min="1"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={`condition-${index}`}>
                    Condition
                  </label>
                  <select
                    id={`condition-${index}`}
                    name="condition"
                    value={item.condition}
                    onChange={(e) => handleItemChange(index, e)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  >
                    <option value="good">Good</option>
                    <option value="damaged">Damaged</option>
                    <option value="defective">Defective</option>
                    <option value="used">Used</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={`returnReason-${index}`}>
                    Return Reason
                  </label>
                  <select
                    id={`returnReason-${index}`}
                    name="returnReason"
                    value={item.returnReason}
                    onChange={(e) => handleItemChange(index, e)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  >
                    <option value="">Select reason</option>
                    <option value="end-of-lease">End of Lease</option>
                    <option value="upgrade">Upgrade</option>
                    <option value="no-longer-needed">No Longer Needed</option>
                    <option value="wrong-item">Wrong Item Ordered</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              
              {items.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeItemRow(index)}
                  className="mt-3 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-sm absolute top-2 right-2"
                  title="Remove item"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>
        
        <div className="flex items-center justify-between">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`bg-green-600 hover:bg-green-800 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline text-lg ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              'Process Return'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReturnItemsDetails;