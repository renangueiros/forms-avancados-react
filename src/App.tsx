import "./styles/global.css";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { supabase } from "./lib/supabase";

const createUserFormSchema = z.object({
  avatar: z
    .instanceof(FileList)
    .transform((list) => list.item(0)!)
    .refine(
      (file) => file!.size <= 5 * 1024 * 1024,
      "O arquivo precisa ter no máximo 5MB"
    ),
  name: z
    .string()
    .min(1, "O nome é obrigatório")
    .transform((name) => {
      return name
        .trim()
        .split(" ")
        .map((word) => {
          return word[0].toLocaleUpperCase().concat(word.substring(1));
        })
        .join(" ");
    }),
  email: z
    .string()
    .min(1, "O e-mail é obrigatório")
    .email("Formato de e-mail inválido")
    .toLowerCase()
    .refine((email) => {
      return email.endsWith(".br");
    }, "O e-mail precisa ter um domínio .br"),
  password: z.string().min(6, "A senha precisa de no mínimo 6 catacteres"),
  techs: z
    .array(
      z.object({
        title: z.string().min(1, "O título é obrigatório"),
        knowledge: z.coerce.number().min(1).max(100),
      })
    )
    .min(2, "Insira pelo menos duas tecnologias"),
});

type CreateuserFormData = z.infer<typeof createUserFormSchema>;

function App() {
  const [output, setOutput] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<CreateuserFormData>({
    resolver: zodResolver(createUserFormSchema),
  });

  const { fields, append } = useFieldArray({
    control: control,
    name: "techs",
  });

  async function createUser(data: CreateuserFormData) {
    await supabase.storage
      .from("forms-avancados-react")
      .upload(data.avatar?.name, data.avatar);

    setOutput(JSON.stringify(data, null, 2));
  }

  function addNewtech() {
    append({ title: "", knowledge: 0 });
  }

  return (
    <main className="h-screen bg-zinc-950 text-zinc-300 flex flex-col gap-10 items-center justify-center">
      <form
        onSubmit={handleSubmit(createUser)}
        className="flex flex-col gap-4 w-full max-w-xs"
      >
        <div className="flex flex-col gap-1">
          <label htmlFor="avatar">Avatar</label>
          <input
            type="file"
            accept="image/*"
            className="border border-zinc-400 shadow-sm rounded h-10 px-3 bg-zinc-800 text-white"
            {...register("avatar")}
          />
          {errors.avatar && (
            <span className="text-red-500 text-sm">
              {errors.avatar.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="name">Nome</label>
          <input
            type="text"
            className="border border-zinc-400 shadow-sm rounded h-10 px-3 bg-zinc-800 text-white"
            {...register("name")}
          />
          {errors.name && (
            <span className="text-red-500 text-sm">{errors.name.message}</span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="email">E-mail</label>
          <input
            type="email"
            className="border border-zinc-400 shadow-sm rounded h-10 px-3 bg-zinc-800 text-white"
            {...register("email")}
          />
          {errors.email && (
            <span className="text-red-500 text-sm">{errors.email.message}</span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="password">Senha</label>
          <input
            type="password"
            className="border border-zinc-400 shadow-sm rounded h-10 px-3 bg-zinc-800 text-white"
            {...register("password")}
          />
          {errors.password && (
            <span className="text-red-500 text-sm">
              {errors.password.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="" className="flex items-center justify-between">
            Tecnologias
            <button
              type="button"
              onClick={addNewtech}
              className="text-emerald-500 text-sm"
            >
              Adicionar
            </button>
          </label>

          {fields.map((field, index) => {
            return (
              <div key={field.id} className="flex gap-2">
                <div className="flex flex-1 flex-col gap-1">
                  <input
                    type="text"
                    className=" border border-zinc-400 shadow-sm rounded h-10 px-3 bg-zinc-800 text-white"
                    {...register(`techs.${index}.title`)}
                  />
                  {errors.techs?.[index]?.title && (
                    <span className="text-red-500 text-sm">
                      {errors.techs[index]?.title?.message}
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <input
                    type="number"
                    className="w-16 border border-zinc-400 shadow-sm rounded h-10 px-3 bg-zinc-800 text-white"
                    {...register(`techs.${index}.knowledge`)}
                  />
                  {errors.techs?.[index]?.knowledge && (
                    <span className="text-red-500 text-sm">
                      {errors.techs[index]?.knowledge?.message}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
          {errors.techs && (
            <span className="text-red-500 text-sm">{errors.techs.message}</span>
          )}
        </div>

        <button
          type="submit"
          className="bg-emerald-500 rounded font-semibold text-white h-10 hover:bg-emerald-600"
        >
          Criar conta
        </button>
      </form>

      <pre>{output}</pre>
    </main>
  );
}

export default App;
