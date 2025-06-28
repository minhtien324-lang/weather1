import React, {useRef, useState} from "react";
import {FaSearch , FaTimes} from "react-icons/fa";
import {fetchWeatherByCoordinates} from "../api/weatherApi";
function SearchBar({ onSearch }) {
    const [location, setLocation] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [loadingSuggestions, setLoadingSuggestions] = useState(false);
    const searchRef = useRef(null);
    const debounce = (func, delay) => {
        let timeoutId;
        return (...args) => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
                timeoutId = setTimeout(() => {
                func(...args);
            }, delay);
        };
    };

    const fetchSuggestionsDebounced = useRef(
        debounce(async (query) => {
            if(query.length > 2){
                setLoadingSuggestions(true);
                try{
                    const data = await fetchWeatherByCoordinates(query);
                    setSuggestions(data);
                }
                catch (error) {
                    console.error("Lỗi khi lấy gợi ý địa điểm: ", error);
                    setSuggestions([]);
                }
                finally {
                    setLoadingSuggestions(false);
                }
            }else {
                setSuggestions([]);
            }
        } , 500)

    ).current;   

    const handleInputChange = (e) => {
        const value = e.target.value;
        setLocation(value);
        fetchSuggestionsDebounced(value);
    };

    const handlePress = async (e) => {
        if (e.key === 'Enter'){
            if(suggestions.length > 0) {
                handleSuggestionsClick(suggestions[0]);
            }else{
                suggestions([]);
            }
        }
    };

    
    const handleSuggestionsClick =(suggestion) => {
        const fullLocationName = `${suggestion.name}, ${suggestion.state ? suggestion.state + ', ' : ''}, ${suggestion.country}`;
    };
    const handleClearClick = () => {
        setLocation('');
        searchRef.current.focus();
    };
    return (
        <div className="relative w-full" ref={searchRef}>
          <div className="flex items-center border border-gray-300 rounded-full px-4 py-2 shadow-sm 
          forcus-within:ring-2 forcus-within:ring-blue-300 
          forcus-winthin:border-blue-500 transition-all duration-200">
            <FaSearch className="text-gray-500 mr-3" />
            <input
                type="text"
                value={location}
                onChange={handleInputChange}
                onKeyDown={handlePress}
                placeholder="Nhập tên thành phố..."
                className="flex-grow outline-none text-gray-700 bg-transparent" 
                />
            {location && (
                <button
                    onClick={handleClearClick }
                    className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
                >
                    <FaTimes />
                </button>
            )}
          </div>
        </div>
    )
}
export default SearchBar;