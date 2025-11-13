import { createContext, useMemo, useCallback } from "react";

// 1. Export the context
export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
    // Environment Variables (Already good)
    const currency = import.meta.env.VITE_CURRENCY || "₹";
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    // 2. Constants for Month Names (Structural cleanup)
    const MONTHS = useMemo(() => ([
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ]), []);

    // 3. Date Formatting Utility (Robustness with useCallback)
    /**
     * Formats a date string from "DD_MM_YYYY" to "DD Month YYYY".
     * @param {string} slotDate - Date string in "DD_MM_YYYY" format.
     * @returns {string} Formatted date string.
     */
    const slotDateFormat = useCallback((slotDate) => {
        // Use destructuring and parseInt for clearer reading and safer conversion
        const [day, monthStr, year] = slotDate.split("_");
        const monthIndex = parseInt(monthStr, 10);

        // Basic validation for robustness
        if (monthIndex < 1 || monthIndex > 12) {
            console.error("Invalid month index:", monthStr);
            return slotDate; // Return original if invalid
        }

        // Adjust index (1-based to 0-based) and format
        return `${day} ${MONTHS[monthIndex - 1]} ${year}`;
    }, [MONTHS]);

    // 4. Age Calculation Utility (Robustness with useCallback)
    /**
     * Calculates age based on a provided date of birth.
     * @param {string} dob - Date of birth string (must be parseable by new Date()).
     * @returns {number} The calculated age in years.
     */
    const calculateAge = useCallback((dob) => {
        const today = new Date();
        const birthDate = new Date(dob);

        // Basic check for valid date
        if (isNaN(birthDate)) {
            console.error("Invalid Date of Birth provided:", dob);
            return 0;
        }

        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();

        // Adjust age if the birth month/day hasn't passed yet
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        return age;
    }, []);

    // 5. Memoize the final context value
    const contextValue = useMemo(() => ({
        backendUrl,
        currency,
        slotDateFormat,
        calculateAge,
    }), [backendUrl, currency, slotDateFormat, calculateAge]);

    return (
        <AppContext.Provider value={contextValue}>
            {children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;