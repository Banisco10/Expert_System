import React, { useState } from "react";

function App() {
  const [data, setData] = useState({
    vegetation_index: "",
    unauthorized_machinery: false,
    water_turbidity: "",
    satellite_image: "",
  });

  const [results, setResults] = useState([]);

  
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setData({
      ...data,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:5000/check_illegal_mining", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      

      const result = await response.json();
      setResults(result.results);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="bg-cover bg-center h-screen min-h-screen flex justify-center items-center bg-gray-100" style={{ backgroundImage: 'url("https://s.rfi.fr/media/display/70f4de3e-de30-11ef-98ed-005056a90284/w:980/Picture%201.%20Illegal%20Miners%20at%20Nnwerem%20in%20the%20Ashanti%20Region%20Credit%20Erastus%20Asare%20Donkor.jpg")' }}>
      <div className="w-2/3 bg-opacity-70 bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-xl font-bold mb-6">Illegal Mining Detection</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Vegetation Index</label>
            <input
              type="number"
              name="vegetation_index"
              value={data.vegetation_index}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Unauthorized Machinery</label>
            <input
              type="checkbox"
              name="unauthorized_machinery"
              checked={data.unauthorized_machinery}
              onChange={handleInputChange}
              className="mt-1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Water Turbidity</label>
            <input
              type="number"
              name="water_turbidity"
              value={data.water_turbidity}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Satellite Image Path</label>
            <input
              type="text"
              name="satellite_image"
              value={data.satellite_image}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-red-600"
          >
            Check Illegal Mining
          </button>
        </form>

        {results.length > 0 && (
          <div className="mt-6">
            <h2 className="font-bold">Results:</h2>
            <ul className="space-y-2">
              {results.map((result, index) => (
                <li key={index} className="text-sm text-red-500">{result}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
