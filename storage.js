// simplified-storage.js - A simpler storage module using JSON instead of CSV

const simpleStorageModule = (function() {
    // Save data to localStorage as JSON string
    function saveToLocalStorage(key, data) {
      if (!data) return false;
      
      try {
        const jsonString = JSON.stringify(data);
        localStorage.setItem(key, jsonString);
        return true;
      } catch (error) {
        console.error('Error saving to localStorage:', error);
        return false;
      }
    }
    
    // Load data from localStorage JSON string
    function loadFromLocalStorage(key) {
      try {
        const jsonString = localStorage.getItem(key);
        
        if (!jsonString) return null;
        
        // Parse JSON string to object
        return JSON.parse(jsonString);
      } catch (error) {
        console.error('Error loading from localStorage:', error);
        return null;
      }
    }
    
    // Initialize storage with default data if empty
    function initStorage(storageKey, defaultData) {
      const existingData = loadFromLocalStorage(storageKey);
      
      if (!existingData) {
        saveToLocalStorage(storageKey, defaultData);
        return defaultData;
      }
      
      return existingData;
    }
    
    // Export data to file for download
    function exportToFile(data, filename) {
      if (!data) {
        console.error('No data to export');
        return;
      }
      
      // Convert data to JSON string
      const jsonString = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      
      // Create download link
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', filename.endsWith('.json') ? filename : filename + '.json');
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    
    // Import data from file
    function importFromFile(file, callback) {
      if (!file) {
        console.error('No file provided');
        return;
      }
      
      const reader = new FileReader();
      
      reader.onload = function(e) {
        try {
          const jsonData = JSON.parse(e.target.result);
          callback(jsonData);
        } catch (error) {
          console.error('Error parsing JSON file:', error);
          callback(null);
        }
      };
      
      reader.readAsText(file);
    }
    
    // Clear storage for a specific key
    function clearStorage(key) {
      localStorage.removeItem(key);
    }
    
    // Public API
    return {
      saveToLocalStorage,
      loadFromLocalStorage,
      initStorage,
      clearStorage,
      exportToFile,
      importFromFile
    };
  })();