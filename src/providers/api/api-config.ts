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
    deleteCourse: `/courses/delete/course`,
    
  },
  modules: {
    getModules: `/courses/get/modules`,
    addModule:`/courses/add/modules`,
    updateModule: `/courses/update/modules`,
    deleteModules: `/courses/delete/module`,
  },
  videos: {
    getVideos: `/courses/get/videos`,
    addVideos:`/courses/add/videos`,
    updateVideos: `/courses/update/videos`,
    deleteVideos: `/courses/delete/videos`,
    uploadVideo: `/courses/videos/upload-direct`
  },
  products : {
    getProducts: `/products`,
    getProductsImages: `/products/images`,
    addProducts: `/products/add`,
    updateProducts: `/products/update`,
    deleteProducts: `/products/delete`,
    productImages: `/products/images/save`,
    prodcutImagesDelete: `/products/images/delete`,
  }
};






