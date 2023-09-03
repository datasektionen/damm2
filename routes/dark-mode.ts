import prisma from '../common/client';
import { adminAuth, authorizePls } from '../common/middlewares';
import express from 'express';

const router = express.Router();


router.get("",

async (_, res) => {
    let value = await prisma.darkMode.findFirst();

    if (!value) {
        value = await prisma.darkMode.create({ data: { value: false }})
    }

    return res.status(200).send(value.value)
})

router.patch("",
    authorizePls,
    adminAuth,
async (req, res) => {
    const previous = await prisma.darkMode.findFirst();
    await prisma.darkMode.updateMany({ data: { value: !(previous?.value) ?? false}})
    const value = await prisma.darkMode.findFirst();

    return res.status(200).send(value?.value)
})

export default router;