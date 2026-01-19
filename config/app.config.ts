export const appConfig = {
    url: process.env.NEXT_PUBLIC_URL!,
    environment: process.env.NODE_ENV

}


export const authConfig = {
    success: appConfig.url + '/auth/success',
    failure: appConfig.url + '/auth/fail'


}