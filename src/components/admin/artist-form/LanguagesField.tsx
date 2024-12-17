import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface LanguagesFieldProps {
  languages: string[]
  availableLanguages: string[]
  setLanguages: (languages: string[]) => void
}

export const LanguagesField = ({
  languages,
  availableLanguages,
  setLanguages,
}: LanguagesFieldProps) => {
  console.log('Current languages:', languages)
  console.log('Available languages:', availableLanguages)
  
  return (
    <div>
      <Label>Languages</Label>
      <Select
        onValueChange={(value) => {
          console.log('Selected language:', value)
          if (!languages.includes(value)) {
            setLanguages([...languages, value])
          }
        }}
      >
        <SelectTrigger className="bg-white">
          <SelectValue placeholder="Select language" />
        </SelectTrigger>
        <SelectContent className="bg-white">
          {availableLanguages
            .filter(lang => !languages.includes(lang))
            .map((lang) => (
              <SelectItem 
                key={lang} 
                value={lang}
                className="bg-white hover:bg-gray-100"
              >
                {lang}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
      <div className="mt-2 flex flex-wrap gap-2">
        {languages.map((lang) => (
          <div
            key={lang}
            className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm flex items-center gap-2"
          >
            {lang}
            <button
              type="button"
              onClick={() => 
                setLanguages(languages.filter((l) => l !== lang))
              }
              className="text-secondary-foreground/50 hover:text-secondary-foreground"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}