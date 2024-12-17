import { useState } from "react";
import { Demo } from "@/types/voiceover";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { DemoUploadFields } from "./DemoUploadFields";

interface DemoManagerProps {
  artistId: string;
  initialDemos: Demo[];
}

export const DemoManager = ({ artistId, initialDemos }: DemoManagerProps) => {
  const [demos, setDemos] = useState<Demo[]>(initialDemos);

  const handleDemoAdd = async (file: File, name: string, isMain: boolean) => {
    try {
      console.log('Uploading new demo:', name);
      const fileName = `${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('demos')
        .upload(fileName, file);

      if (uploadError) {
        console.error('Demo upload error:', uploadError);
        throw new Error('Failed to upload demo');
      }

      const { data: { publicUrl } } = supabase.storage
        .from('demos')
        .getPublicUrl(fileName);

      const { data: demoData, error: insertError } = await supabase
        .from('demos')
        .insert({
          artist_id: artistId,
          name,
          url: publicUrl,
          is_main: isMain
        })
        .select()
        .single();

      if (insertError) {
        console.error('Error inserting demo:', insertError);
        throw insertError;
      }

      console.log('Demo added successfully:', demoData);
      setDemos([...demos, demoData]);
      toast.success('Demo added successfully');
    } catch (error) {
      console.error('Error in handleDemoAdd:', error);
      toast.error('Failed to add demo: ' + (error as Error).message);
    }
  };

  const handleDemoRemove = async (demoId: string) => {
    try {
      console.log('Removing demo:', demoId);
      const { error } = await supabase
        .from('demos')
        .delete()
        .eq('id', demoId);

      if (error) {
        console.error('Error removing demo:', error);
        throw error;
      }

      setDemos(demos.filter(demo => demo.id !== demoId));
      toast.success('Demo removed successfully');
    } catch (error) {
      console.error('Error in handleDemoRemove:', error);
      toast.error('Failed to remove demo: ' + (error as Error).message);
    }
  };

  const handleDemoNameChange = async (demoId: string, name: string) => {
    try {
      console.log('Updating demo name:', demoId, name);
      const { error } = await supabase
        .from('demos')
        .update({ name })
        .eq('id', demoId);

      if (error) {
        console.error('Error updating demo name:', error);
        throw error;
      }

      setDemos(demos.map(demo => 
        demo.id === demoId ? { ...demo, name } : demo
      ));
    } catch (error) {
      console.error('Error in handleDemoNameChange:', error);
      toast.error('Failed to update demo name: ' + (error as Error).message);
    }
  };

  return (
    <DemoUploadFields
      demos={demos}
      onDemoAdd={handleDemoAdd}
      onDemoRemove={handleDemoRemove}
      onDemoNameChange={handleDemoNameChange}
    />
  );
};