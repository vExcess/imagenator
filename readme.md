# Imagenator

In 2014, Bob Lyon created "Imagenator" ([http://la94022.com/~blyon/Javascript/KAImage/](http://la94022.com/~blyon/Javascript/KAImage/)) which allowed users to load custom images into the Khan Academy PJS environment.

In 2021, I created "Imagenator 2" to improve upon the problems of Bob Lyon's Imagenator.
- Imagenator 2 has much superior compression over Imagenator
- Imagenator 2 has a much easier to use GUI
- Imagenator 2 has a max image size of 600x600 instead of 400x400 pixels
- Imagenator 2 supports storing images as grayscale
- Imagenator 2 supports variable compression rates
- Imagenator 2 is open source instead of proprietary

Over the course four years, Imagenator 2 did gain a decent amount of usage, but Bob Lyon's is still the far more popular option. The lack of widespread adoption is primarily the result of me being banned from KA. But Imagenator 2 does have two significant flaws.
- The variable compression works by reducing colors, however it reduces colors in a suboptimal way that degrades the image extremely quickly.
- Despite the compression being much better than Bob Lyon's, it's still nowhere near as good as it could be.

In 2025, I am revamping my imagenator repo to not just contain my Imagenator 2, but to include Bob Lyon's Imagenator (by reverse engineering its compressed source code) in addition to my own. This way users can use Bob Lyon's with a better GUI and more easily compare its output to my own imagenator. 

In addition, I am developing a new imagenator I call "Vector Imagenator" that converts images to vector based graphics that can be rendered in Khan Academy's PJS environment. For many graphics storing as a vector graphic will be much more efficient than storing it as a raster graphic.

Lastly, I will be adding a QOI image converter to the imagenator options to choose from. 