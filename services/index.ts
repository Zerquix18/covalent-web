import Covalent from "covalent-sdk";

export const covalentService = new Covalent({ key: process.env.NEXT_PUBLIC_COVALENT_API_KEY || '' });
