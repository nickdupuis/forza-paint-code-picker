import type { MetaFunction } from "@remix-run/node";
import { Outlet, useLoaderData, useNavigate } from "@remix-run/react";
import ColorPicker from "~/components/ColorPicker";
import { CarColor } from "~/types/CarColor";

export const meta: MetaFunction = () => {
    return [
        { title: "Forza Color Selector" },
    ];
};

export default function ColorDatabase() {
    const colorList: CarColor[] = useLoaderData();
    const navigate = useNavigate();

    // Handle the change from ColorPicker
    const onColorChange = (color: CarColor) => {
        if (color) {
            navigate(`./${color.id}`);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col lg:flex-row gap-8">
                <section className="lg:w-72 flex-shrink-0">
                    <ColorPicker
                        colors={colorList}
                        handleColorChange={onColorChange}
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