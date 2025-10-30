// src/pages/PackDetailsPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// Components
import ImageGallery from "@/components/PackDetails/ImageGallery";
import PackHeader from "@/components/PackDetails/PackHeader";
import PackDescription from "@/components/PackDetails/PackDescription";
import PackDetails from "@/components/PackDetails/PackDetails";
import Destinations from "@/components/PackDetails/Destinations";
import BookingCard from "@/components/PackDetails/BookingCard";
import DestinationsMap from "@/components/PackDetails/DestinationsMap";

export default function PackDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pack, setPack] = useState(null);

    useEffect(() => {
        const loadPackDetails = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await fetch(`http://localhost:3000/api/packs/${id}`);
                if (!response.ok) throw new Error("Failed to fetch pack details");

                const data = await response.json();
                setPack(data);
            } catch (err) {
                setError(err.message || "Could not load pack details");
            } finally {
                setLoading(false);
            }
        };

        if (id) loadPackDetails();
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#05073c] mx-auto mb-4"></div>
                    <p className="text-[#05073c]">Loading pack details...</p>
                </div>
            </div>
        );
    }

    if (error || !pack) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Card className="max-w-md w-full mx-4">
                    <CardContent className="p-6 text-center">
                        <p className="text-red-500 mb-4">{error || "Pack not found"}</p>
                        <Button onClick={() => navigate(-1)} variant="outline">
                            Go Back
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-6">
                    <ImageGallery
                        cover={pack.profileImg}
                        images={[
                            ...(pack.guidesPlacesId?.flatMap(place => place.images || []) || [])
                        ]}
                        altPrefix={pack.title}
                    />

                    <PackHeader pack={pack} />
                    <PackDescription description={pack.description} />
                    <PackDetails pack={pack} />
                    <Destinations places={pack.guidesPlacesId} />

                    <DestinationsMap
                        places={pack.guidesPlacesId}
                        startLocation={pack.startLocation}
                        endLocation={pack.endLocation}
                    />
                </div>

                {/* Right Column */}
                <div className="lg:col-span-1">
                    <BookingCard pack={pack} />
                </div>
            </div>
        </div>
    );
}
