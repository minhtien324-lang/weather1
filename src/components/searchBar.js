import React, {useRef, useState, useEffect} from "react";
import {FaSearch , FaTimes} from "react-icons/fa";
import {fetchGeoCoordinates} from "../api/weatherApi";
import styles from "../styles/SearchBar.module.css";

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
                    const data = await fetchGeoCoordinates(query);
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
        // Giới hạn độ dài input để tránh spam
        if (value.length <= 100) {
            setLocation(value);
            fetchSuggestionsDebounced(value);
        }
    };


    const handleSearchClick = () => {
        if(location.trim() !== '') {
            onSearch(location.trim());
            setLocation('');
            setSuggestions([]);
            searchRef.current.blur();
        }
    };
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            if(suggestions.length > 0) {
                handleSuggestionsClick(suggestions[0]);
            }else {
                handleSearchClick();
            }
        }
    }
    const handleSuggestionsClick =(suggestion) => {
        const fullLocationName = `${suggestion.name}, ${suggestion.state ? suggestion.state + ', ' : ''}, ${suggestion.country}`;
        setLocation(fullLocationName);
        onSearch(suggestion);
        setSuggestions([]);
    };
    const handleClearClick = () => {
        setLocation('');
        setSuggestions([]);
        searchRef.current.focus();
    };
    return (
        <div className={styles.container} ref={searchRef}>
          <div className={styles.searchBox}>
            <FaSearch className={styles.searchIcon} />
            <input
                type="text"
                value={location}
                onChange={handleInputChange}
                onKeyDown={handleKeyPress}
                placeholder="Nhập tên thành phố..."
                className={styles.input} 
                />
            {location && (
                <button
                    onClick={handleClearClick }
                    className={styles.clearButton}
                >
                    <FaTimes className="w-5 h-5" />
                </button>
            )}
            <button 
            onClick={handleSearchClick}
            className={styles.searchButton}
            >
                Tìm kiếm
            </button>
          </div>
          {loadingSuggestions &&(
            <div className={styles.loadingSuggestions}>
                Đang tải gợi ý...
            </div>
          )}
          {!loadingSuggestions && suggestions.length > 0 && (
            <ul className={styles.suggestionsList}> 
                {suggestions.map((s, index) => (
                 <li 
                    key={index}
                    className={styles.suggestionItem}
                    onClick={() => handleSuggestionsClick(s)}
                 >
                  {`${s.name}${s.state ? ', ' + s.state : ''}, ${s.country}`}     
                 </li>   
                ))}
            </ul>
          )}
        </div>
    );
}
export default SearchBar;