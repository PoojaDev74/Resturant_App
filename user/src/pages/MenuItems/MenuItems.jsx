import React, { useEffect, useState } from "react";
import "./MenuItems.css";
import axios from "axios";

const MenuItems = () => {
  const [image, setImage] = useState(false);
  const [data, setData] = useState({
    name: "",
    price: "",
    category: "Select",
  });

  const HandleChange = (e) => {
    const { name, value } = e.target;
    setData((prevdata) => ({
      ...prevdata,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataForm = new FormData();
    dataForm.append("name", data.name);
    dataForm.append("price", Number(data.price));
    dataForm.append("category", data.category);
    dataForm.append("image", image);

    try {
      const res = await axios.post(`https://resturant-app-ss.onrender.com/api/food/add`, dataForm);

      if (res.data.success) {
        setData({
          name: "",
          price: "",
          category: "Select",
        });
        setImage(false);
        alert("Item added successfully!");
      } else {
        console.log("Upload failed:");
      }
    } catch (error) {
      console.error("Error during form submission:", error);
      alert("Something went wrong.");
    }
  };

  //List
  const [list, setList] = useState([]);

  const fetchList = async () => {
    const res = await axios.get(`https://resturant-app-ss.onrender.com/api/food/list`);
    if (res.data.success) {
      setList(res.data.data);
    } else {
      console.log("error");
    }
  };
  const deleteItem = async (foodId) => {
    console.log(foodId);
    const res = await axios.post(`https://resturant-app-ss.onrender.com/api/food/delete`, { id: foodId });
    await fetchList();
    if (res.data.success) {
      alert("Item deleted successfully!");
    } else {
      alert("error");
    }
  };
  useEffect(() => {
    fetchList();
  }, []);


  return (
    <div className="container">
      <div className="add">
        <form className="flexCol" onSubmit={handleSubmit}>
          <div className="addImage flexCol">
            <p>Upload Image</p>
            <label htmlFor="image">
              {image ? (
                <img src={URL.createObjectURL(image)} alt="preview" />
              ) : (
                <i className="fa-solid fa-cloud-arrow-up upload-icon"></i>
              )}
            </label>
            <input
              onChange={(e) => setImage(e.target.files[0])}
              type="file"
              id="image"
              hidden
              required
            />
          </div>
          <div className="ItemName flexCol">
            <p>Item Name</p>
            <input
              onChange={HandleChange}
              value={data.name}
              type="text"
              name="name"
              placeholder="enter Item name"
            />
          </div>
          <div className="itemPrice flexCol">
            <p>Item Price</p>
            <input
              onChange={HandleChange}
              value={data.price}
              type="number"
              name="price"
              placeholder="Enter Price"
            />
          </div>
          <div className="addCategory flexCol">
            <p>Item Category</p>
            <select
              onChange={HandleChange}
              value={data.category}
              name="category"
            >
              <option value="Select">Select</option>
              <option value="Fries">Fries</option>
              <option value="Salad">Salad</option>
              <option value="Coffee">Coffee</option>
              <option value="Sandwich">Sandwich</option>
              <option value="Rolls">Rolls</option>
              <option value="Pizza">Pizza</option>
              <option value="Burger">Burger</option>
              <option value="Pasta">Pasta</option>
              <option value="Deserts">Deserts</option>
            </select>
          </div>
          <button type="submit" className="addBtn">
            ADD
          </button>
        </form>
      </div>
      <div className="list">
        <p className="listHeading">Food List</p>
        <div className="food-grid">
          {list.map((item, index) => (
            <div className="food-card" key={index}>
              <div className="food-image">
                <img src={item.image} alt={item.name} />
              </div>
              <div className="food-details">
                <p><strong>Name:</strong> {item.name}</p>
                <p><strong>Price:</strong> ₹{item.price}</p>
                <p><strong>Category:</strong> {item.category}</p>
                <button
                  className="delete-btn"
                  onClick={() => deleteItem(item._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}

        </div>
      </div>
    </div>
  );
};

export default MenuItems;
