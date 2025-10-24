import React, { useState, useEffect, useRef } from "react";
import "./Instruction.css";

const Instruction = ({ onClose, onSave, initialInstructions }) => {
  const [text, setText] = useState(initialInstructions || "");
  const modalRef = useRef(null);

  useEffect(() => {
    const handleFocus = () => {
      setTimeout(() => {
        modalRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 300);
    };

    const textarea = document.querySelector("textarea");
    textarea?.addEventListener("focus", handleFocus);
    return () => textarea?.removeEventListener("focus", handleFocus);
  }, []);

  const handleInputChange = (event) => {
    setText(event.target.value);
  };

  const handleSave = () => {
    onSave(text);
  };

  return (
    <div className="instructions-overlay">
      <div className="instruction-sheet" ref={modalRef}>
       <button className="close-button" onClick={onClose}>
        X
       </button>
        <h2>Add Cooking instructions</h2>
        <textarea value={text} onChange={handleInputChange} />
        <p className="note">
          The restaurant will try its best to follow your request. However,
          refunds or cancellations in this regard won't be possible.
        </p>
        <div className="actions">
          <button className="cancel" onClick={onClose}>Cancel</button>
          <button className="next" onClick={handleSave}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
};
export default Instruction;
