import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { addUser } from "./utils/userSlice";

const BASE_URL = import.meta.env.VITE_API_URL_USER_SERVICE;

const EditProfile = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();

  
  const [formData, setFormData] = useState({
    name: "",
    about: "",
    dob: "",
    gender: "",
    pincode: "",
    town: "",
  });

  const [photos, setPhotos] = useState([]); 
  console.log("photos",photos);
  
  const [newPhoto, setNewPhoto] = useState(null); 
  const [previewUrl, setPreviewUrl] = useState(""); // Preview of new photo
  const [isLoading, setIsLoading] = useState(false);

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); 
    const year = String(date.getFullYear()).slice(-2); 
  
    return `${day}/${month}/${year}`;
  };
  
  // Initialize form data and photos when user data is available
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        about: user.about || "",
        dob: user.dob ? formatDate(user.dob) : "", 
        gender: user.gender || "",
        pincode: user.pincode || "",
        town: user.town || "",
      });
      setPhotos(user.photoUrl || []); // Initialize photos
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handlePhotoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNewPhoto(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddPhoto = async () => {
    if (!newPhoto) return;

    setIsLoading(true);

    try {
      // Upload new photo to backend
      const formData = new FormData();
      formData.append("photos", newPhoto);

      const response = await axios.post(`${BASE_URL}/upload-photo`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },withCredentials:true
      });


      console.log(response.data[0]);
      
      // Update photos array with the new photo URL
      const newPhotoUrl = response.data[0];
      const updatedPhotos = [...photos, newPhotoUrl];
      setPhotos(updatedPhotos);

      // Update Redux store
      dispatch(
        addUser({
          ...user,
          photoUrl: updatedPhotos,
        })
      );

      // Reset new photo state
      setNewPhoto(null);
      setPreviewUrl("");
    } catch (error) {
      console.error("Error uploading photo:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePhoto = async (photoUrl) => {
    setIsLoading(true);

    try {
        const encodedPhotoUrl = encodeURIComponent(photoUrl);
        await axios.delete(`${BASE_URL}/delete-photo/${encodedPhotoUrl}`, {
            withCredentials: true,
        });

        const updatedPhotos = photos.filter((url) => url !== photoUrl);
        setPhotos(updatedPhotos);

        dispatch(
            addUser({
                ...user,
                photoUrl: updatedPhotos,
            })
        );
    } catch (error) {
        console.error("Error deleting photo:", error);
    } finally {
        setIsLoading(false);
    }
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
  
    try {
      
      const response = await axios.patch(
        `${BASE_URL}/userService/profile/edit`,
        {
          ...formData,
          photoUrl: photos, 
        },
        {
          headers: {
            "Content-Type": "application/json", 
          },
          withCredentials: true, 
        }
      );
  
      // Update Redux store
      dispatch(addUser(response.data));
  
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsLoading(false);
    }
  };
  

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Name Input */}
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          {/* Gender Input */}
          <div>
            <label className="block text-sm font-medium mb-1">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Date of Birth Input */}
          <div>
            <label className="block text-sm font-medium mb-1">Date of Birth</label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          {/* Pincode Input */}
          <div>
            <label className="block text-sm font-medium mb-1">Pincode</label>
            <input
              type="text"
              name="pincode"
              value={formData.pincode}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          {/* Town Input */}
          <div>
            <label className="block text-sm font-medium mb-1">Town</label>
            <input
              type="text"
              name="town"
              value={formData.town}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          {/* About Input */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">About</label>
            <textarea
              name="about"
              value={formData.about}
              onChange={handleInputChange}
              rows="3"
              className="w-full px-3 py-2 border rounded-md"
            ></textarea>
          </div>
        </div>

        {/* Photo Management Section */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Profile Photos</h2>

          {/* Photo Preview Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
            {photos.map((photoUrl, index) => (
              <div key={index} className="relative group border rounded-md overflow-hidden">
                <img
                  src={photoUrl}
                  alt={`Profile Photo ${index + 1}`}
                  className="w-full h-32 object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleDeletePhoto(photoUrl)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 shadow-md"
                  disabled={isLoading}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ))}

            {/* New Photo Preview */}
            {previewUrl && (
              <div className="relative border-2 border-blue-500 rounded-md overflow-hidden">
                <img
                  src={previewUrl}
                  alt="New Photo Preview"
                  className="w-full h-32 object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-blue-500 text-white text-xs py-1 text-center">
                  New Photo
                </div>
              </div>
            )}

            {/* Add Photo Button */}
            {photos.length < 5 && !previewUrl && (
              <div
                onClick={() => document.getElementById("photo-upload").click()}
                className="border-2 border-dashed border-gray-300 rounded-md h-32 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <span className="text-sm text-gray-500 mt-1">Add Photo</span>
              </div>
            )}
          </div>

          {/* Hidden file input */}
          <input
            id="photo-upload"
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className="hidden"
          />

          {/* Action buttons for new photo */}
          {previewUrl && (
            <div className="flex gap-3 mt-2">
              <button
                type="button"
                onClick={handleAddPhoto}
                disabled={isLoading}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300"
              >
                {isLoading ? "Uploading..." : "Upload Photo"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setNewPhoto(null);
                  setPreviewUrl("");
                }}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="mt-6">
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-gray-300"
          >
            {isLoading ? "Saving..." : "Save Profile"}
          </button>
        </div>
      </form>c
    </div>
  );
};

export default EditProfile;