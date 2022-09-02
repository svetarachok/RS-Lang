import { AuthorizationData } from '../types/interfaces';

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
      return parsedData;
    } return false;
  }

  getUserIdData(): AuthorizationData {
    const data = localStorage.getItem('UserId')!;
    const parsedData = JSON.parse(data);
    return parsedData;
  }

  checkData(key: string): Boolean {
    const keyToCheck: string | null = localStorage.getItem(key);
    if (keyToCheck) return true;
    return false;
  }

  clear() {
    localStorage.clear();
  }
}

export const storage = new Storage();
