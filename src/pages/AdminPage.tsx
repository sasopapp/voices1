import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { languages } from "@/data/voiceover-artists";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  avatar: z.string().url({
    message: "Please enter a valid URL for the avatar.",
  }),
  languages: z.array(z.string()).min(1, {
    message: "Please select at least one language.",
  }),
  audioDemo: z.string().url({
    message: "Please enter a valid URL for the audio demo.",
  }),
});

const AdminPage = () => {
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      avatar: "",
      languages: [],
      audioDemo: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast.error("You must be logged in to submit an artist");
        navigate("/login");
        return;
      }

      const { data: artist, error } = await supabase
        .from("artists")
        .insert({
          name: values.name,
          avatar: values.avatar,
          languages: values.languages,
          audio_demo: values.audioDemo,
          created_by: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      // Notify admin about new submission
      const response = await supabase.functions.invoke("notify-admin", {
        body: {
          artistName: values.name,
          artistId: artist.id,
        },
      });

      if (!response.error) {
        toast.success("Artist submitted successfully!");
        form.reset();
        setSelectedLanguages([]);
      } else {
        console.error("Failed to send admin notification");
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  const handleLanguageSelect = (language: string) => {
    const newLanguages = selectedLanguages.includes(language)
      ? selectedLanguages.filter((l) => l !== language)
      : [...selectedLanguages, language];
    
    setSelectedLanguages(newLanguages);
    form.setValue("languages", newLanguages);
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-8 text-3xl font-bold">Add New Artist</h1>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Artist name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="avatar"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Avatar URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/avatar.jpg" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="languages"
              render={() => (
                <FormItem>
                  <FormLabel>Languages</FormLabel>
                  <div className="flex flex-wrap gap-2">
                    {languages.map((language) => (
                      <Button
                        key={language}
                        type="button"
                        variant={selectedLanguages.includes(language) ? "default" : "outline"}
                        onClick={() => handleLanguageSelect(language)}
                      >
                        {language}
                      </Button>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="audioDemo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Audio Demo URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/demo.mp3" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">Add Artist</Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default AdminPage;