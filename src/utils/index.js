
'use strict';

const onError = (err) => {
  console.error(`Error: ${err}`);
};

const setValueToStorage = (keysValues) => {
  // Function to set value into storages.
  //    @param value: Object
  browser.storage.sync.set(keysValues)
    .then( (results) => {
      return results;
    })
    .catch( (error) => {
      onError(error);
      browser.storage.local.set(keysValues)
        .then( (results) => {
          return results;
        })
        .catch(onError);
    });
};

const getValueFromStorage = (keysValues) => {
  // Function to get value from storages.
  //    @param value: Object
  const keys = keys(keysValues);
  browser.storage.sync.get(keys)
    .then( (results) => {
      return results;
    })
    .catch( (error) => {
      onError(error);
      browser.storage.local.get(keysValues)
        .then( (results) => {
          return results;
        })
        .catch(onError);
    });
};

export { onError, setValueToStorage, getValueFromStorage };
