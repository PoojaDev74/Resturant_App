// src/components/Tables/Tables.jsx
import React, { useState, useEffect } from "react";
import "./Tables.css";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faChair } from "@fortawesome/free-solid-svg-icons";

const Tables = () => {
  const [tables, setTables] = useState([]); // Real backend tables
  const [newTable, setNewTable] = useState({ chairs: "01" });
  const [showForm, setShowForm] = useState(false);

  const fetchTables = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/food/tables");
      setTables(res.data);
    } catch (err) {
      console.error("Failed to fetch tables:", err);
    }
  };

  const handleCreateTable = async () => {
    try {
      const res = await axios.post("http://localhost:4000/api/food/tables", {
        tableNumber: newTable.chairs,
      });

      if (res.status === 200) {
        fetchTables(); // Refresh after adding
        setShowForm(false);
        setNewTable({ chairs: "01" });
      }
    } catch (error) {
      console.error("Failed to create table:", error);
    }
  };

  const handleDeleteTable = async (id) => {
    try {
      const res = await axios.delete(`http://localhost:4000/api/food/tables/${id}`);
      if (res.status === 200) {
        fetchTables(); // Refresh after deletion
      }
    } catch (error) {
      console.error("Failed to delete table:", error);
    }
  };

  useEffect(() => {
    fetchTables();
  }, []);

  return (
    <div className="Main">
      <div className="TableContainer">
        <h2 className="TableHeading">Tables</h2>
        <div className="TablesGrid">
          {tables.map((table, index) => (
            <div key={table._id} className="SingleTable">
              <button className="TableBtn" onClick={() => handleDeleteTable(table._id)}>
                <FontAwesomeIcon icon={faTrash} />
              </button>
              <div className="TableId">Table {String(index + 1).padStart(2, "0")}</div>
              <small className="ChairIcon">
                <FontAwesomeIcon icon={faChair} /> {table.tableNumber}
              </small>
            </div>
          ))}

          <div className="TableForm" onClick={() => setShowForm(true)}>
            <div>+</div>
          </div>
        </div>

        {showForm && (
          <div className="ShowForm">
            <div className="FormModal">
              <h3 className="FormHeading">Create New Table</h3>
              <label>
                <span className="Formlabel">Chairs:</span>
                <input
                  type="number"
                  className="FormInput"
                  value={newTable.chairs}
                  onChange={(e) => setNewTable({ chairs: e.target.value })}
                />
              </label>
              <div className="FormCancelCreate">
                <button className="FormCancel" onClick={() => setShowForm(false)}>
                  Cancel
                </button>
                <button className="FormCreate" onClick={handleCreateTable}>
                  Create
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tables;
