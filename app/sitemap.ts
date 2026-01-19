import { Metadata, MetadataRoute } from "next";

export default function sitemap():MetadataRoute.Sitemap {

    const returnUrl = (endpoint:string= "")=>{
        return `${process.env.APP_URL}/${endpoint}`
    }

    return [
        {
            url: returnUrl(),
            priority: 1,
            lastModified: new Date(),
            alternates: {
                languages: {
                    en:  returnUrl()
                }
            }
        }
    ]
}