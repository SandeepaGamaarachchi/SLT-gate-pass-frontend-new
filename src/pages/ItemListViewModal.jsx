import React, { useEffect, useState } from "react";
import axios from "axios";

const ItemListModal = ({ id, onClose }) => {
  const [items, setItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState({});

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/requests/${id}`);
        const itemList = response.data.items || [];
        setItems(itemList);
      } catch (error) {
        console.error("Failed to load items:", error);
      }
    };

    if (id) fetchItems();
  }, [id]);

  const handleCheckboxChange = (index) => {
    setSelectedItems((prev) => ({
      ...prev,
      [index]: prev[index] ? undefined : { quantity: 1 },
    }));
  };

  const handleQuantityChange = (index, value) => {
    setSelectedItems((prev) => ({
      ...prev,
      [index]: {
        ...prev[index],
        quantity: Number(value),
      },
    }));
  };

  const handleSubmit = async () => {
    const itemsToReturn = Object.keys(selectedItems).map((index) => ({
      item: items[index],
      returnQuantity: selectedItems[index].quantity,
    }));

    try {
      await axios.post(`http://localhost:5000/api/receiver/${id}/return-items`, {
        items: itemsToReturn,
      });

      alert("Return information saved successfully!");
      onClose();
    } catch (error) {
      console.error("Failed to save return items:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-white/30 backdrop-blur-sm">
      <div className="bg-white rounded-lg p-8 w-full max-w-2xl shadow-xl">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Select Items to Return</h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <ul className="space-y-4 max-h-80 overflow-y-auto pr-2">
            {items.map((item, index) => (
              <li
                key={index}
                className="flex items-center justify-between p-4 bg-blue-100 rounded-md"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    onChange={() => handleCheckboxChange(index)}
                    checked={!!selectedItems[index]}
                    className="w-4 h-4"
                  />
                  <div>
                    <div className="font-medium text-gray-700">{item.itemName}</div>
                    <div className="text-sm text-gray-500">Qty: {item.quantity}</div>
                  </div>
                </div>

                {selectedItems[index] && (
                  <input
                    type="number"
                    value={selectedItems[index].quantity}
                    min={1}
                    max={item.quantity}
                    onChange={(e) => handleQuantityChange(index, e.target.value)}
                    className="w-20 px-2 py-1 border rounded-md text-sm"
                  />
                )}
              </li>
            ))}
          </ul>

          <div className="mt-6 flex justify-end gap-3 me-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ItemListModal;
