import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useNavigate } from "react-router-dom";

const Popup = ({ setShowPopup }) => {
  const navigate = useNavigate();

  const handleOkClick = () => {
    setShowPopup(false);
    navigate("/my-request");
  };

  return (
    <Dialog.Root open={true} onOpenChange={setShowPopup}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 w-full h-full bg-black opacity-40" />
        <Dialog.Content className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-full max-w-lg mx-auto px-4">
          <div className="bg-white rounded-md shadow-lg px-4 py-6 text-center">
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-green-100 rounded-full">
              ✅
            </div>
            <Dialog.Title className="text-lg font-medium text-gray-800 mt-3">
              Request Updated Successfully!
            </Dialog.Title>
            <Dialog.Close asChild>
              <div className="flex justify-center mt-4">
                <button
                  onClick={handleOkClick}
                  className="w-32 p-2.5 bg-[#172b59] text-white rounded-md"
                >
                  OK
                </button>
              </div>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default Popup;
