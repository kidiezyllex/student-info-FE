import cookies from "js-cookie";

/**
 * Check if user is authenticated by checking both cookies and localStorage
 * @returns {boolean} - Returns true if user is authenticated, otherwise false
 */
export const isAuthenticated = (): boolean => {
  const cookieToken = cookies.get("accessToken");
  let localStorageToken = null;

  if (typeof window !== "undefined") {
    try {
      const tokenString = localStorage.getItem("token");
      if (tokenString) {
        const tokenObj = JSON.parse(tokenString);
        localStorageToken = tokenObj.token || tokenObj;
      }
      
      const accessToken = localStorage.getItem("accessToken");
      if (accessToken) {
        localStorageToken = accessToken;
      }
    } catch (error) {
      console.error(error);
    }
  }

  return !!cookieToken || !!localStorageToken;
};

/**
 * Check if profile API response is valid
 * @param profileData - Profile data returned from API
 * @returns {boolean} - Returns true if profile is valid, false if there is an error
 */
export const isValidProfileResponse = (profileData: any): boolean => {
  if (!profileData) return false;
  
  if (profileData.data && profileData.data._id) return true;
  
  return false;
};

/**
 * Check authentication and redirect if not logged in
 * @param {Function} redirectFn - Redirect function (usually router.replace)
 * @param {any} profileData - Profile data from API (optional)
 * @returns {boolean} - Authentication status
 */
export const checkAuthAndRedirect = (
  redirectFn: (path: string) => void, 
  profileData?: any
): boolean => {
  if (profileData && !isValidProfileResponse(profileData)) {
    clearAuthData();
    return false;
  }
  
  const isAuth = isAuthenticated();
  if (!isAuth) {
    return false;
  }
  
  return true;
};

export const clearAuthData = (): void => {
  cookies.remove("accessToken");
  
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    localStorage.removeItem("userProfile");
  }
}; 