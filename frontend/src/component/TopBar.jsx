import React from 'react'

const TopBar =({heading,text})=> {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="pl-10 sm:pl-0">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-red-600 via-red-500 to-red-700 bg-clip-text text-transparent">{heading}</h1>
              <p className="text-gray-600">{text}</p>
            </div>
          </div>
        </header>
  )
}
export default TopBar;
