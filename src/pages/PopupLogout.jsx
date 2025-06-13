import { CircleCheckBig } from "lucide-react"; // Importing the CircleCheckBig icon

const PopupLogout = ({ onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-7 rounded-lg shadow-lg text-center">

        {/* Check Icon */}
        <CircleCheckBig size={32} className="mx-auto mb-4 text-blue-900" />
        {/* Title */}
        <h1 className="text-2xl font-bold text-blue-900 mb-4">Sign Out</h1>

        {/* Confirmation Text */}
        <h2 className="text-lg text-black font-semibold mb-4">Are you sure you want to sign out?</h2>
        
        <div className="flex justify-center gap-6">
          <button
            className="bg-blue-900 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-300"
            onClick={onConfirm}
          >
            Yes
          </button>
          <button
            className="bg-gray-400 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-500 transition-all duration-300"
            onClick={onCancel}
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default PopupLogout;
