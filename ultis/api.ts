// api.ts
import axios from 'axios';

export const SHEET_URL = 'https://sheet.best/api/sheets/7a554dfc-95ef-466a-b93c-d1a4b9bdef34';

export const fetchSheetData = async () => {
    const res = await axios.get(SHEET_URL);
    return res.data;
};

export const patchCheckIn = async (phoneNumber: string) => {
    const res = await axios.patch(`${SHEET_URL}/search?手機號碼 Mobile Number=${phoneNumber}`, {
        check: 'yes',
    });
    return res.data;
};
