import { Button } from "@/components/ui/button"
import {
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogOverlay,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { FieldGroup, Label } from "@/components/ui/field"
import { Input, TextField } from "@/components/ui/textfield"
import { NumberField, NumberFieldInput, NumberFieldSteppers } from "../ui/numberfield"
import { useState } from "react"

export function ModalDemo({buyCrypto}:any) {
    const [quantity, setQuantity] = useState(1)
    return (
        <DialogTrigger>
            <Button className={"bg-green-400 px-8 dark:text-white text-white rounded-full font-bold h-10 hover:cursor-pointer"} variant="solid">BUY</Button>
            <DialogOverlay>
                <DialogContent className="sm:max-w-[425px]">
                    {({ close }) => (
                        <>
                            <DialogHeader>
                                <DialogTitle>Invest in your future :)</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <NumberField defaultValue={10} minValue={1}>
                                    <Label className="p-2 ">Quantity</Label>
                                    <FieldGroup className={'my-4'}>
                                        <NumberFieldInput onChange={(e)=>{setQuantity(e.target.value)}}/>
                                        <NumberFieldSteppers />
                                    </FieldGroup>
                                </NumberField>
                            </div>
                            <DialogFooter>
                                <Button onPress={buyCrypto()} type="submit" className={'bg-green-600 dark:bg-green-400 uppercase font-bold cursor-pointer'}>
                                    Buy Now
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </DialogContent>
            </DialogOverlay>
        </DialogTrigger>
    )
}
