import React, {useState} from "react";

function SearchBar({ onSearch }) {
    const [location, setLocation] = useState('');

    const handleInputChange = (e) => {
        setLocation(e.target.value);
    };
    const handleClickSearch = () => {
       if (location.trim()){
            onSearch(location.trim());
            setLocation('');
       }
    };
    const handlePress = (event) => {
        if (event.key === 'Enter') {
            handleClickSearch();
        }
    };
    return (
        <div className="flex items-center space-x-2 p-2 bg-white rounded-xl shadow-stone-100 max-w-xl mx-auto">
           <input 
           type="text"
           className="flex-grow p-3 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-orange-300 text-stone-700"
                placeholder="Nhập tên thành phố..."
                value={location}
                onChange={handleInputChange}
                onKeyPress={handlePress}
                />
                <button
                onClick={handleClickSearch}
                className="p-3 bg-orange-500 text-white rounded-lg 
                hover:bg-orange-600 transition duration-200 ease-in-out shadow-md 
                focus:outline-none focus:ring-2 focus:ring-orange-300 flex-shrink-0">
                Tìm kiếm
            </button>
        </div>
    )
}
export default SearchBar;