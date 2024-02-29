import { json, type MetaFunction } from "@remix-run/node";
import { Outlet, useLoaderData, useNavigate } from "@remix-run/react";
import ColorPicker from "~/components/ColorPicker";
import prisma from "~/prisma";
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
        <div className="flex flex-col bg-gray-300 p-8 h-screen">
            <div className="flex items-center gap-12">
                <section>
                    <ColorPicker
                        colors={colorList}
                        handleColorChange={onColorChange}
                    />
                </section>
                <section>
                    <Outlet />
                </section>
            </div>
        </div>
    );
}

export const loader = async () => {
    return json(await prisma.colors.findMany());
};