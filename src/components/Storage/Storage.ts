export class Storage {
  setData(key: string, value: string | object) {
    if (typeof value === 'object') {
      const strValue = JSON.stringify(value);
      localStorage.setItem(key, strValue);
    } else {
      localStorage.setItem(key, value);
    }
  }

  getData(key: string) {
    const data = localStorage.getItem(key);
    if (data) {
      const parsedData = JSON.parse(data);
      console.log(data);
      return parsedData;
    } return {};
  }

  checkData(key: string): Boolean {
    console.log(localStorage.getItem(key));
    const keyToCheck: string | null = localStorage.getItem(key);
    console.log(keyToCheck);
    if (keyToCheck) return true;
    return false;
  }
}
