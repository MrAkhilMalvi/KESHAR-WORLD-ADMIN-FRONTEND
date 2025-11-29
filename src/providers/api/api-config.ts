export const AUTH_ENDPOINTS = {
  login: {
    login: `/admin-login/`,
    verifyOTP: `/admin-login/verifyOTP`,
    resendOTP: `/admin-login/resendOTP`,
  },
  forgotPassword: {
    forgotPassword: `/forgot-password/verify/mobile`,
    verifyOTP: `/forgot-password/verifyOTP`,
    resendOTP: `/forgot-password/resendOTP`,
    setPassword: `/forgot-password/update/password`,
  },

  dashboard: {
    dashboard: `/dashboard`,
  },
  courses: {
    getAllCourse : `/courses/get/all_courses`,
    addCourse: `/courses/add`,
    updateCourse: `/courses/update`,
    deleteCourse: `/courses/delete`,
  },
  modules: {
    getModules: `/courses/get/modules`,
    addModule:`/courses/add/modules`,
    updateModule: `/courses/update/modules`,
    deleteModules: `/modules/delete`,
  },
  videos: {
    getVideos: `/courses/get/videos`,
    addVideos:`/courses/add/videos`,
    updateVideos: `/courses/update/videos`,
    deleteVideos: `/video/delete`,
  },
  products : {
    getProducts: `/products`,
    addProducts: `/products/add`,
    updateProducts: `/products/update`,
    deleteProducts: `/products/delete`
  }
};




