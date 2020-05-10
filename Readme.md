Assume a website that records user interactions with different html elements by firing a simple get request for an image. The image returned will be a 1x1 gif, but all the data needed by the server will be passed in the request as GET parameters so the server can read the required data. Multiple such pixels will keep firing with data as the user interacts with the website. Many such requests may slow down the user interaction. You need to write a Javascript service worker that will intercept these pixel requests and return a response immediately, while it keeps firing these pixels in the background. The pixels being fired also contain data in a different format than the one expected on the server, the fields being passed will have to be renamed to the ones accepted by the server. Below given is a map of what params are being passed by the website to the corresponding parameter names expected by the server. 

{ “interaction”: “event”, “client”: “customer”, “os_name”: “operating_system_name”, “x1”: “utm_source”, “x2”: “utm_medium”, “x3”: “utm_campaign”, “landing_url”: “campaign_url” }

For example - 
Pixel fired on the website - 
http://www.xyz.com/pixel.gif?interaction=UserClick&client=ad_media&os_name=macos&x1=go ogle&x2=email&x3=pdfconvert&landing_url=abcd1

Translated pixel - 
http://www.xyz.com/pixel.gif?event=UserClick&customer=ad_media&operating_system_name= macos&utm_source=google&utm_medium=email&utm_campaign=pdfconvert&campaign_url=a bcd1