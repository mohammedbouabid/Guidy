import React from "react"
import useEmblaCarousel from "embla-carousel-react"
import AutoScroll from "embla-carousel-auto-scroll"

const Logos3 = ({
    heading = "Our Partners",
    logos = [
        {
            id: "logo-9",
            description: "Attijariwafa Bank",
            image: "https://www.attijariwafabank.com/sites/default/files/2020-09/desktop_0.png",
            className: "h-7 w-auto",
        },
        {
            id: "logo-10",
            description: "CTM",
            image: "https://upload.wikimedia.org/wikipedia/fr/1/1f/Logo_CTM.png",
            className: "h-7 w-auto",
        },
        {
            id: "logo-11",
            description: "Kenzi Hotels",
            image: "https://images.seeklogo.com/logo-png/27/1/kenzi-hotels-logo-png_seeklogo-274574.png",
            className: "h-7 w-auto",
        },
        {
            id: "logo-12",
            description: "Glovo",
            image: "https://upload.wikimedia.org/wikipedia/commons/c/c6/Glovo_logo.png",
            className: "h-7 w-auto",
        },
        {
            id: "logo-13",
            description: "Orange Maroc",
            image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Orange_logo.svg/1200px-Orange_logo.svg.png",
            className: "h-7 w-auto",
        },
        {
            id: "logo-15",
            description: "OCP Group",
            image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Ocp-group.png/250px-Ocp-group.png",
            className: "h-7 w-auto",
        },
        {
            id: "logo-16",
            description: "Inwi",
            image: "https://seeklogo.com/images/I/inwi-logo-B3E61A8F47-seeklogo.com.png",
            className: "h-7 w-auto",
        },
        {
            id: "logo-17",
            description: "Barceló Hotels",
            image: "https://seeklogo.com/images/B/barcelo-hotel-group-logo-A1AF167E52-seeklogo.com.png",
            className: "h-7 w-auto",
        },
        {
            id: "logo-18",
            description: "Atlas Hospitality",
            image: "https://www.infomediaire.net/wp-content/uploads/2019/06/ATLAS-HOSPITALITY.jpg",
            className: "h-7 w-auto",
        },
        {
            id: "logo-19",
            description: "Maroc Telecom",
            image: "https://www.iam.ma/ImagesMarocTelecom/Phototh%C3%A8que/Images-originales/maroc-telecom-logo-3267-4-originale.jpg",
            className: "h-7 w-auto",
        },
        {
            id: "logo-20",
            description: "Wafa Assurance",
            image: "https://www.attijariwafabank.com/sites/default/files/styles/medium/public/2022-02/wafa%20assurance%402x.png",
            className: "h-7 w-auto",
        },
        {
            id: "logo-21",
            description: "CIH Bank",
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8IyzAdjsc7fb5CXUZ-_8y7RVzJzgtjxo8YA&s",
            className: "h-7 w-auto",
        },
        {
            id: "logo-22",
            description: "BMCE Bank",
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSm88mCPxRIdWuSSgDt9vTEM6jC2v11QZ2BhA&s",
            className: "h-7 w-auto",
        },
        {
            id: "logo-23",
            description: "Royal Air Maroc",
            image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Logo_Royal_Air_Maroc.svg/1200px-Logo_Royal_Air_Maroc.svg.png",
            className: "h-7 w-auto",
        },
    ],
}) => {
    const [emblaRef] = useEmblaCarousel({ loop: true }, [AutoScroll({ playOnInit: true, speed: 1 })])

    return (
        <section className="py-20 bg-white">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-[#05073c]">{heading}</h2>
            </div>

            <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex">
                    {logos.map((logo) => (
                        <div
                            key={logo.id}
                            className="flex-shrink-0 flex items-center justify-center px-10 py-4 w-1/3 sm:w-1/4 md:w-1/5 lg:w-1/6"
                        >
                            <img
                                src={logo.image}
                                alt={logo.description}
                                className={logo.className}
                                loading="lazy"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Logos3
