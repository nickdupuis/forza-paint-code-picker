import type { MetaFunction } from "@remix-run/node";
import { Outlet, useLoaderData, useNavigate, useParams } from "@remix-run/react";
import { useEffect } from "react";
import ColorPicker from "~/components/ColorPicker";
import { CarColor } from "~/types/CarColor";

export const meta: MetaFunction = () => {
    return [
        { title: "Forza Horizon Paint Code Database | Search 10,000+ Colors" },
        { name: "description", content: "Search Forza Horizon paint codes by manufacturer and color name. Get exact HSB slider values for any car color including Porsche, BMW, Ferrari, and more." },
    ];
};

export default function ColorDatabase() {
    const colorList: CarColor[] = useLoaderData();
    const navigate = useNavigate();
    const params = useParams();

    // Restore last selected color when returning to this tab
    useEffect(() => {
        if (!params.colorId) {
            const lastId = sessionStorage.getItem("lastColorId");
            if (lastId) {
                navigate(`./${lastId}`, { replace: true });
            }
        }
    }, []);

    // Handle the change from ColorPicker
    const onColorChange = (color: CarColor) => {
        if (color) {
            sessionStorage.setItem("lastColorId", color.id);
            navigate(`./${color.id}`);
        }
    };

    // Determine initial color from URL or sessionStorage
    const initialColorId = params.colorId || sessionStorage.getItem("lastColorId") || undefined;
    const initialColor = initialColorId ? colorList.find(c => c.id === initialColorId) : undefined;

    return (
        <div className="space-y-8">
            <div className="flex flex-col lg:flex-row gap-8">
                <section className="lg:w-72 flex-shrink-0">
                    <ColorPicker
                        colors={colorList}
                        handleColorChange={onColorChange}
                        initialColor={initialColor}
                    />
                </section>
                <section className="flex-1">
                    <Outlet />
                </section>
            </div>
        </div>
    );
}

export const clientLoader = async () => {
    const res = await fetch(`${import.meta.env.BASE_URL}colors.json`);
    return res.json();
};

clientLoader.hydrate = true;