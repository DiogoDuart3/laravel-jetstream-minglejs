import React, {useEffect, useState, useTransition} from "react";

import {Progress} from "@/components/ui/progress";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {CheckIcon, PlusCircleIcon, PlusIcon, XIcon} from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    MAX_UPLOAD_IMAGE_SIZE,
    MAX_UPLOAD_IMAGE_SIZE_IN_MB,
} from "@/app-config";
import {businessSchema} from "@/zodSchemas/business";
import {toast} from "@/components/ui/use-toast";

const schema = businessSchema.omit({imageId: true}).extend({
    image: z
        .instanceof(File)
        .refine((file) => file.size < MAX_UPLOAD_IMAGE_SIZE, {
            message: `Image size should not exceed ${MAX_UPLOAD_IMAGE_SIZE_IN_MB}MB`,
        })
        .optional(),
});

function CreateBusinessWizard() {
    const [pending, startTransition] = useTransition();
    const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | null>(null);
    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: {
            image: undefined,
            name: "",
            bio: "",
            address_street: "",
            address_city: "",
            address_state: "",
            address_zip: "",
            address_country: "",
            opening_hours: [
                {
                    day: "monday",
                    open: "10:00",
                    close: "22:00",
                },
            ],
        },
    });
    const [currentStepValid, setCurrentStepValid] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);

    const handleNext = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setCurrentStep(currentStep + 1);
    };
    const handlePrev = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setCurrentStep(currentStep - 1);
    };
    const onSubmit = (data: z.infer<typeof schema>) => {
        if (currentStep < 4) {
            return;
        }
        startTransition(() => {
            const formData = new FormData();
            const hasImage = data.image && data.image.size > 0;
            if (data.image) {
                formData.append("image", data.image);
            }
            delete data.image;
            /*createBusinessAction({...data, imageWrapper: hasImage ? formData : undefined}).then(() => {
                toast({
                    title: "Negócio criado",
                    description: "O seu negócio foi criado com sucesso.",
                });
                router.push("/dashboard/");
            });*/
        });
    };

    const validateFormFields = (
        fieldsToValidate: (keyof z.infer<typeof schema>)[]
    ) => {
        return fieldsToValidate.every((field) => {
            const fieldState = form.getFieldState(
                field as keyof z.infer<typeof schema>
            );
            // Check if the field is required in the schema
            const isRequired =
                schema.shape[field as keyof z.infer<typeof schema>]._def.typeName !==
                "ZodOptional";
            // Field is valid if it's not required and empty, or if it's dirty and has no error
            return (
                (!isRequired && !fieldState.isDirty) ||
                (fieldState.isDirty && !fieldState.error)
            );
        });
    };
    const validateCurrentStep = () => {
        if (currentStep === 1) {
            const fieldsToValidate = ["name", "image"] as (keyof z.infer<
                typeof schema
            >)[];
            const isValid = validateFormFields(fieldsToValidate);
            setCurrentStepValid(isValid);
        } else if (currentStep === 2) {
            setCurrentStepValid(true);
        } else if (currentStep === 3) {
            const fieldsToValidate = [
                "address_street",
                "address_city",
                "address_state",
                "address_zip",
                "address_country",
                "contact_email",
                "contact_phone",
            ] as (keyof z.infer<typeof schema>)[];
            const isValid = validateFormFields(fieldsToValidate);
            setCurrentStepValid(isValid);
        }
    };

    useEffect(() => validateCurrentStep(), [currentStep, form.watch()]);

    useEffect(() => {
        const image = form.watch("image");
        if (image) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(image);
        } else {
            setLogoPreviewUrl(null);
        }
    }, [form.watch("image")]);

    const getDayOfTheWeekPT = (dayEn: string) => {
        const days = {
            monday: "Segunda-feira",
            tuesday: "Terça-feira",
            wednesday: "Quarta-feira",
            thursday: "Quinta-feira",
            friday: "Sexta-feira",
            saturday: "Sábado",
            sunday: "Domingo",
        };
        return days[dayEn as keyof typeof days];
    };

    return (
        <div className="w-full max-w-xl mx-auto">
            <div className="bg-background rounded-lg shadow-lg p-8">
                <div className="flex gap-4 items-center mb-8">
                    <div className="flex-1">
                        <Progress value={(currentStep / 4) * 100}/>
                    </div>
                    <div className="text-sm font-medium text-muted-foreground">
                        Passo {currentStep} de 4
                    </div>
                </div>
                <Form {...form}>
                    <form
                        onSubmit={
                            currentStep === 4
                                ? form.handleSubmit(onSubmit)
                                : (e) => e.preventDefault()
                        }
                        className="min-h-[380px] flex flex-col"
                    >
                        <div className="h-full">
                            {currentStep === 1 && (
                                <div>
                                    <h2 className="text-2xl font-bold mb-2">Perfil do Negócio</h2>
                                    <p className="text-muted-foreground mb-6">
                                        Estas informações serão mostradas no perfil do negócio.
                                    </p>
                                    <div className="space-y-4">
                                        <FormField
                                            control={form.control}
                                            name="name"
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormLabel>Nome</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Restaurante do João"
                                                            {...field}
                                                            autoComplete="off"
                                                        />
                                                    </FormControl>
                                                    <FormDescription>
                                                        Este nome será usado para identificar seu negócio.
                                                    </FormDescription>
                                                    <FormMessage/>
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="image"
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormLabel>Logo</FormLabel>
                                                    <FormControl>
                                                        <div className="flex items-start space-x-4">
                                                            <div className="space-y-2 w-full">
                                                                <Input
                                                                    type="file"
                                                                    accept="image/*"
                                                                    onChange={(e) => {
                                                                        const file = e.target.files?.[0];
                                                                        if (file) {
                                                                            if (file.size > MAX_UPLOAD_IMAGE_SIZE) {
                                                                                form.setError("image", {
                                                                                    type: "manual",
                                                                                    message: `Image size should not exceed ${MAX_UPLOAD_IMAGE_SIZE_IN_MB}MB`,
                                                                                });
                                                                            } else {
                                                                                field.onChange(file);
                                                                            }
                                                                        }
                                                                    }}
                                                                />
                                                                <FormDescription>
                                                                    Carregar imagem (max{" "}
                                                                    {MAX_UPLOAD_IMAGE_SIZE_IN_MB}MB).
                                                                </FormDescription>
                                                            </div>
                                                            {logoPreviewUrl && (
                                                                <div className="relative flex-shrink-0 size-24">
                                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                                    <img
                                                                        src={logoPreviewUrl}
                                                                        alt="Logo preview"
                                                                        className="w-full h-full object-cover rounded"
                                                                    />
                                                                    <button
                                                                        type="button"
                                                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full"
                                                                        onClick={() => field.onChange("")}
                                                                    >
                                                                        <XIcon className="size-4"/>
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage/>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>
                            )}
                            {currentStep === 2 && (
                                <div>
                                    <h2 className="text-2xl font-bold mb-2">
                                        Horário de Funcionamento
                                    </h2>
                                    <p className="text-muted-foreground mb-6">
                                        Insira o horário de funcionamento do seu negócio.
                                    </p>
                                    <div className="space-y-2">
                                        <div className="space-y-2">
                                            {form.watch("opening_hours").length === 0 && (
                                                <p className="text-muted-foreground">
                                                    Nenhum horário de funcionamento adicionado.
                                                </p>
                                            )}
                                            {form.watch("opening_hours")?.map((hour, index) => (
                                                <div key={index} className="flex gap-4">
                                                    <div className="flex items-center justify-end font-medium w-40">
                                                        <FormField
                                                            control={form.control}
                                                            name="opening_hours.0.day"
                                                            render={({field}) => (
                                                                <FormItem className="w-full">
                                                                    <FormControl>
                                                                        <Select
                                                                            onValueChange={field.onChange}
                                                                            defaultValue={field.value}
                                                                        >
                                                                            <SelectTrigger>
                                                                                <SelectValue
                                                                                    placeholder="Segunda-feira"/>
                                                                            </SelectTrigger>
                                                                            <SelectContent>
                                                                                <SelectItem value="monday">
                                                                                    Segunda-feira
                                                                                </SelectItem>
                                                                                <SelectItem value="tuesday">
                                                                                    Terça-feira
                                                                                </SelectItem>
                                                                                <SelectItem value="wednesday">
                                                                                    Quarta-feira
                                                                                </SelectItem>
                                                                                <SelectItem value="thursday">
                                                                                    Quinta-feira
                                                                                </SelectItem>
                                                                                <SelectItem value="friday">
                                                                                    Sexta-feira
                                                                                </SelectItem>
                                                                                <SelectItem value="saturday">
                                                                                    Sábado
                                                                                </SelectItem>
                                                                                <SelectItem value="sunday">
                                                                                    Domingo
                                                                                </SelectItem>
                                                                            </SelectContent>
                                                                        </Select>
                                                                    </FormControl>
                                                                </FormItem>
                                                            )}
                                                        />
                                                    </div>
                                                    <div
                                                        className="col-span-4 flex items-center justify-end font-medium">
                                                        <FormField
                                                            control={form.control}
                                                            name="opening_hours.0.open"
                                                            render={({field}) => (
                                                                <FormItem className="w-full">
                                                                    <FormControl>
                                                                        <Input type="time" {...field} />
                                                                    </FormControl>
                                                                </FormItem>
                                                            )}
                                                        />
                                                    </div>
                                                    <div
                                                        className="col-span-4 flex items-center justify-end font-medium">
                                                        <FormField
                                                            control={form.control}
                                                            name="opening_hours.0.close"
                                                            render={({field}) => (
                                                                <FormItem className="w-full">
                                                                    <FormControl>
                                                                        <Input type="time" {...field} />
                                                                    </FormControl>
                                                                </FormItem>
                                                            )}
                                                        />
                                                    </div>
                                                    <div className="col-span-2 flex items-center justify-end ms-auto">
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => {
                                                                const currentHours =
                                                                    form.getValues("opening_hours");
                                                                form.setValue(
                                                                    "opening_hours",
                                                                    currentHours.filter((_, index) => index !== 0)
                                                                );
                                                            }}
                                                        >
                                                            <XIcon className="h-4 w-4"/>
                                                            <span className="sr-only">
                                Remove opening hours
                              </span>
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <Button
                                            type="button"
                                            onClick={() =>
                                                form.setValue("opening_hours", [
                                                    ...(form.getValues("opening_hours") ?? []),
                                                    {day: "monday", open: "10:00", close: "22:00"},
                                                ])
                                            }
                                        >
                                            <PlusCircleIcon className="h-4 w-4"/>
                                            <span className="ms-2">Adicionar Horário</span>
                                        </Button>
                                    </div>
                                </div>
                            )}
                            {currentStep === 3 && (
                                <div>
                                    <h2 className="text-2xl font-bold mb-2">
                                        Contacto/Localização
                                    </h2>
                                    <p className="text-muted-foreground mb-6">
                                        Insira o endereço do seu negócio para que os clientes possam
                                        encontrá-lo.
                                    </p>
                                    <div className="space-y-2">
                                        <FormField
                                            control={form.control}
                                            name="address_street"
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormLabel>Rua</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Rua do Comércio, 123"
                                                            {...field}
                                                            value={field.value ?? ""}
                                                        />
                                                    </FormControl>
                                                    <FormMessage/>
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="address_city"
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormLabel>Cidade</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Lisboa" {...field}
                                                               value={field.value ?? ""}/>
                                                    </FormControl>
                                                    <FormMessage/>
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="address_state"
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormLabel>Concelho/Província</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Lisboa" {...field}
                                                               value={field.value ?? ""}/>
                                                    </FormControl>
                                                    <FormMessage/>
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="address_zip"
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormLabel>Código Postal</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="1000-001" {...field}
                                                               value={field.value ?? ""}/>
                                                    </FormControl>
                                                    <FormMessage/>
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="address_country"
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormLabel>País</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Portugal" {...field}
                                                               value={field.value ?? ""}/>
                                                    </FormControl>
                                                    <FormMessage/>
                                                </FormItem>
                                            )}
                                        />
                                        <div className="py-4">
                                            <hr/>
                                        </div>
                                        <FormField
                                            control={form.control}
                                            name="contact_email"
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormLabel>Email de Contacto</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="info@seunegocio.com"
                                                            {...field}
                                                            value={field.value ?? ""}
                                                        />
                                                    </FormControl>
                                                    <FormMessage/>
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="contact_phone"
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormLabel>Telefone de Contacto</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="+351 123 456 789" {...field}
                                                               value={field.value ?? ""}/>
                                                    </FormControl>
                                                    <FormMessage/>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>
                            )}
                            {currentStep === 4 && (
                                <div>
                                    <h2 className="text-2xl font-bold mb-2">Rever e Criar</h2>
                                    <p className="text-muted-foreground mb-6">
                                        Valide as informações e clique em criar.
                                    </p>
                                    <div className="space-y-2">
                                        <div className="space-y-4">
                                            <div className="flex items-center space-x-4">
                                                <div className="w-20 h-20 bg-gray-200 rounded-full overflow-hidden">
                                                    {logoPreviewUrl ? (
                                                        /* eslint-disable-next-line @next/next/no-img-element */
                                                        <img
                                                            src={logoPreviewUrl}
                                                            alt="Business Logo"
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div
                                                            className="w-full h-full flex items-center justify-center text-gray-400">
                                                            No Logo
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold">
                                                        {form.watch("name")}
                                                    </h3>
                                                    <p className="text-sm text-muted-foreground">
                                                        {form.watch("bio")}
                                                    </p>
                                                </div>
                                            </div>
                                            <div>
                                                <h4 className="font-semibold mb-2">Endereço</h4>
                                                <p>
                                                    <span className="font-medium">Rua:</span>{" "}
                                                    {form.watch("address_street")?.length
                                                        ? form.watch("address_street")
                                                        : "Não informado"}
                                                </p>
                                                <p>
                                                    <span className="font-medium">Cidade:</span>{" "}
                                                    {form.watch("address_city")?.length
                                                        ? form.watch("address_city")
                                                        : "Não informado"}
                                                </p>
                                                <p>
                          <span className="font-medium">
                            Concelho/Província:
                          </span>{" "}
                                                    {form.watch("address_state")?.length
                                                        ? form.watch("address_state")
                                                        : "Não informado"}
                                                </p>
                                                <p>
                                                    <span className="font-medium">Código Postal:</span>{" "}
                                                    {form.watch("address_zip")?.length
                                                        ? form.watch("address_zip")
                                                        : "Não informado"}
                                                </p>
                                                <p>
                                                    <span className="font-medium">País:</span>{" "}
                                                    {form.watch("address_country")?.length
                                                        ? form.watch("address_country")
                                                        : "Não informado"}
                                                </p>
                                            </div>
                                            <div>
                                                <h4 className="font-semibold mb-2">Contato</h4>
                                                <p>
                                                    <span className="font-medium">Email:</span>{" "}
                                                    {form.watch("contact_email") ?? "Não informado"}
                                                </p>
                                                <p>
                                                    <span className="font-medium">Telefone:</span>{" "}
                                                    {form.watch("contact_phone") ?? "Não informado"}
                                                </p>
                                            </div>
                                            <div>
                                                <h4 className="font-semibold mb-2">
                                                    Horário de Funcionamento
                                                </h4>
                                                {form.watch("opening_hours").length === 0 ? (
                                                    <p className="text-sm text-muted-foreground">
                                                        Nenhum horário de funcionamento adicionado.
                                                    </p>
                                                ) : (
                                                    <>
                                                        {form.watch("opening_hours").map((hour, index) => (
                                                            <p key={index}>
                                                                {getDayOfTheWeekPT(hour.day)}: {hour.open} -{" "}
                                                                {hour.close}
                                                            </p>
                                                        ))}
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="flex justify-between mt-auto pt-8">
                            {currentStep > 1 ? (
                                <Button type="button" variant="outline" onClick={handlePrev}>
                                    Anterior
                                </Button>
                            ) : (
                                <div></div>
                            )}
                            {currentStep < 4 ? (
                                <Button type="button" disabled={!currentStepValid} onClick={handleNext}>
                                    Próximo
                                </Button>
                            ) : (
                                <Button type="submit" disabled={pending}>
                                    Criar
                                    <CheckIcon className="h-4 w-4 ms-2"/>
                                </Button>
                            )}
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
}


export default CreateBusinessWizard;
