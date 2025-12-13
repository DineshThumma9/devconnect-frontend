import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import useInitStore from "@/store/initStore"
import { saveUserInterests } from "@/api/userClient"

const INTEREST_CATEGORIES = {
    "Frontend": ["React", "Vue", "Angular", "Svelte", "Next.js", "Tailwind CSS", "TypeScript", "JavaScript"],
    "Backend": ["Node.js", "Python", "Java", "Go", "Rust", "PHP", "Ruby", "C#"],
    "Database": ["PostgreSQL", "MongoDB", "MySQL", "Redis", "Cassandra", "DynamoDB", "Firebase"],
    "DevOps": ["Docker", "Kubernetes", "AWS", "Azure", "GCP", "CI/CD", "Terraform", "Jenkins"],
    "Mobile": ["React Native", "Flutter", "Swift", "Kotlin", "iOS", "Android"],
    "AI/ML": ["TensorFlow", "PyTorch", "Machine Learning", "Deep Learning", "NLP", "Computer Vision"],
    "Other": ["Blockchain", "Web3", "Game Development", "Security", "Testing", "Microservices"]
}

export default function InterestsPage() {
    const navigate = useNavigate()
    const { setInterestsCompleted } = useInitStore()
    const [selectedInterests, setSelectedInterests] = useState<string[]>([])
    const [error, setError] = useState<string>("")
    const [isLoading, setIsLoading] = useState(false)

    const MIN_SELECTIONS = 5

    const toggleInterest = (interest: string) => {
        setSelectedInterests(prev => {
            if (prev.includes(interest)) {
                return prev.filter(i => i !== interest)
            } else {
                return [...prev, interest]
            }
        })
        setError("")
    }

    const handleContinue = async () => {
        if (selectedInterests.length < MIN_SELECTIONS) {
            setError(`Please select at least ${MIN_SELECTIONS} interests`)
            return
        }

        setIsLoading(true)
        setError("")

        try {
            console.log("Selected interests:", selectedInterests)
            console.log("Total selected:", selectedInterests.length)
            
            // Save interests to backend
            await saveUserInterests(selectedInterests)
            console.log("✅ Interests saved to backend successfully")
            
            // Mark interests as completed so user never sees this page again
            setInterestsCompleted(true)
            
            navigate("/app")
        } catch (err) {
            console.error("❌ Failed to save interests:", err)
            setError("Failed to save interests. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    const handleSkip = () => {
        console.log("User skipped interests selection")
        setInterestsCompleted(true)
        navigate("/app")
    }

    return (
        <div className="min-h-screen bg-gray-950 text-white py-12 px-4">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent">
                        Tell us what you're interested in
                    </h1>
                    <p className="text-gray-400 text-lg mb-2">
                        Select at least {MIN_SELECTIONS} topics to personalize your experience
                    </p>
                    <p className="text-teal-400 font-semibold">
                        {selectedInterests.length} / {MIN_SELECTIONS} selected
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-900/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-6 text-center">
                        {error}
                    </div>
                )}

                {/* Interest Categories */}
                <div className="space-y-8 mb-8">
                    {Object.entries(INTEREST_CATEGORIES).map(([category, interests]) => (
                        <Card key={category} className="bg-gray-900 border-gray-700">
                            <CardContent className="p-6">
                                <h2 className="text-xl font-semibold text-white mb-4">{category}</h2>
                                <div className="flex flex-wrap gap-3">
                                    {interests.map(interest => {
                                        const isSelected = selectedInterests.includes(interest)
                                        return (
                                            <Badge
                                                key={interest}
                                                onClick={() => toggleInterest(interest)}
                                                className={`cursor-pointer px-4 py-2 text-sm transition-all duration-200 ${
                                                    isSelected
                                                        ? "bg-teal-600 hover:bg-teal-700 text-white border-teal-500"
                                                        : "bg-gray-800 hover:bg-gray-700 text-gray-300 border-gray-600"
                                                }`}
                                                variant="outline"
                                            >
                                                {interest}
                                                {isSelected && (
                                                    <span className="ml-2">✓</span>
                                                )}
                                            </Badge>
                                        )
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Action Buttons */}
                <div className="flex justify-center gap-4">
                    <Button
                        onClick={handleSkip}
                        variant="outline"
                        className="bg-transparent border-gray-600 text-gray-400 hover:bg-gray-800 hover:text-white px-8"
                    >
                        Skip for now
                    </Button>
                    <Button
                        onClick={handleContinue}
                        className={`px-8 ${
                            selectedInterests.length >= MIN_SELECTIONS && !isLoading
                                ? "bg-teal-600 hover:bg-teal-700"
                                : "bg-gray-700 cursor-not-allowed"
                        }`}
                        disabled={selectedInterests.length < MIN_SELECTIONS || isLoading}
                    >
                        {isLoading ? "Saving..." : "Continue to DevConnect"}
                    </Button>
                </div>

                {/* Selected Interests Preview */}
                {selectedInterests.length > 0 && (
                    <div className="mt-8 p-4 bg-gray-800 rounded-lg">
                        <h3 className="text-sm font-semibold text-gray-400 mb-2">Your selections:</h3>
                        <div className="flex flex-wrap gap-2">
                            {selectedInterests.map(interest => (
                                <Badge key={interest} className="bg-teal-600 text-white">
                                    {interest}
                                </Badge>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
