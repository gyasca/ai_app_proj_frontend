import { useState } from 'react';
import axios from 'axios';

export default function Food() {
  //   const [image, setImage] = useState(null);
  //   const [foodData, setFoodData] = useState(null);
  //   const [loading, setLoading] = useState(false);

  //   const handleFileChange = (e) => {
  //     setImage(e.target.files[0]);
  //   };

  //   const handleSubmit = async (e) => {
  //     e.preventDefault();
  //     if (!image) {
  //       alert("Please upload an image.");
  //       return;
  //     }

  //     setLoading(true);

  //     const formData = new FormData();
  //     formData.append('image', image);

  //     try {
  //       // Send the image directly to the Flask API
  //       const response = await axios.post('http://localhost:3001/foodmodel/identify-food', formData, {
  //         headers: { 'Content-Type': 'multipart/form-data' },
  //       });

  //       setFoodData(response.data);
  //     } catch (error) {
  //       console.error("Error detecting food:", error);
  //       alert("An error occurred while processing the image.");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   return (
  //     <div className="min-h-screen bg-white flex items-center justify-center py-6">
  //       <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md border border-gray-300">
  //         <h1 className="text-3xl font-semibold text-center text-black mb-6">Food Identification</h1>
  //         <form onSubmit={handleSubmit} className="space-y-4">
  //           <div className="flex justify-center">
  //             <label htmlFor="file-upload" className="cursor-pointer">
  //               <input
  //                 type="file"
  //                 id="file-upload"
  //                 accept="image/*"
  //                 onChange={handleFileChange}
  //                 className="hidden"
  //               />
  //               <div className={`bg-black text-white px-4 py-2 rounded-md text-center w-full hover:bg-gray-800 ${image ? 'bg-gray-500' : ''}`}>
  //                 {image ? image.name : 'Choose File'}
  //               </div>
  //             </label>
  //           </div>
  //           <button
  //             type="submit"
  //             disabled={loading}
  //             className={`w-full py-2 rounded-md text-white ${loading ? 'bg-gray-400' : 'bg-black hover:bg-gray-800'} focus:outline-none`}
  //           >
  //             {loading ? 'Processing...' : 'Upload and Detect'}
  //           </button>
  //         </form>

  //         {foodData && (
  //           <div className="mt-6 text-black">
  //             <h2 className="text-xl font-semibold text-center">Food Detected: {foodData.name}</h2>
  //             <h2 className="text-xl font-semibold text-center">Ingredients: {foodData.ingredients}</h2>
  //             <div className="mt-6 flex justify-center">
  //               <img
  //                 src={`http://localhost:3001${foodData.image}`}  // Prepend base URL
  //                 alt="Uploaded Food"
  //                 className="w-64 h-64 object-cover rounded-md"
  //               />

  //             </div>
  //           </div>
  //         )}
  //       </div>
  //     </div>
  //   );
  // }
  const [image, setImage] = useState(null);
  const [foodData, setFoodData] = useState(null);
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
      alert("Please upload an image.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("image", image);

    try {
      const response = await axios.post(
        "http://localhost:3001/foodmodel/identify-food",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const { name, image: foodImage, ingredients: ingredientsDict } = response.data;

      setFoodData({ name, image: foodImage });

      // Convert ingredients dictionary to array of objects
      const ingredientsArray = Object.entries(ingredientsDict).map(
        ([ingredientName, quantity]) => ({
          name: ingredientName,
          quantity: quantity,
        })
      );

      setIngredients(ingredientsArray);
    } catch (error) {
      console.error("Error detecting food:", error);
      alert("An error occurred while processing the image.");
    } finally {
      setLoading(false);
    }
  };

  const incrementIngredient = (index) => {
    setIngredients((prev) => {
      const updated = [...prev];
      updated[index].quantity = (updated[index].quantity || 1) + 1;
      return updated;
    });
  };

  const decrementIngredient = (index) => {
    setIngredients((prev) => {
      const updated = [...prev];
      updated[index].quantity = Math.max((updated[index].quantity || 1) - 1, 0);
      return updated;
    });
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-6">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl border border-gray-300">
        <h1 className="text-3xl font-semibold text-center text-black mb-6">
          Food Identification
        </h1>
        {!foodData ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex justify-center">
              <label htmlFor="file-upload" className="cursor-pointer">
                <input
                  type="file"
                  id="file-upload"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div
                  className={`bg-black text-white px-4 py-2 rounded-md text-center w-full hover:bg-gray-800 ${image ? "bg-gray-500" : ""
                    }`}
                >
                  {image ? image.name : "Choose File"}
                </div>
              </label>
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 rounded-md text-white ${loading ? "bg-gray-400" : "bg-black hover:bg-gray-800"
                } focus:outline-none`}
            >
              {loading ? "Processing..." : "Upload and Detect"}
            </button>
          </form>
        ) : (
          <div className="flex">
            {/* Left half: Food name and image */}
            <div className="w-1/2 pr-4 border-r border-gray-300">
              <h2 className="text-xl font-semibold text-center mb-4">
                Dish Name: {foodData.name}
              </h2>
              <div className="flex justify-center">
                <img
                  src={`http://localhost:3001${foodData.image}`}
                  alt="Uploaded Food"
                  className="w-64 h-64 object-cover rounded-md"
                />
              </div>
            </div>

            {/* Right half: Ingredients list */}
            <div className="w-1/2 pl-4 flex flex-col">
              <h2 className="text-xl font-semibold text-center mb-4">
                Ingredients
              </h2>
              <div className="flex-1 overflow-y-auto border rounded-md p-4">
                {ingredients.map((ingredient, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center mb-2 border-b pb-2"
                  >
                    <span className="font-medium text-gray-700">{ingredient.name}</span>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => decrementIngredient(index)}
                        className="px-2 py-1 bg-gray-300 rounded-md hover:bg-gray-400"
                      >
                        -
                      </button>
                      <span>{ingredient.quantity || 1}</span>
                      <button
                        onClick={() => incrementIngredient(index)}
                        className="px-2 py-1 bg-gray-300 rounded-md hover:bg-gray-400"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex justify-between">
                <button
                  onClick={() => {
                    setFoodData(null);
                    setIngredients([]);
                  }}
                  className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                >
                  Back
                </button>
                <button
                  onClick={() => alert("Ingredients saved!")}
                  className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
