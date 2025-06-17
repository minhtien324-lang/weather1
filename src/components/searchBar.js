import React from "react";

function SearchBar() {
    return (
        <div className="p-4 bg-white rounded-lg shadow-md flex items-center">
            <input 
                type="text"
                placeholder="Tìm kiếm thành phố..."
                className=" p-2 border border-gray-300 rounded-md w-full max-w-sm"/>
                <button className="mt-2 bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600">Tìm Kiếm</button>
        </div>
    )
}
export default SearchBar;