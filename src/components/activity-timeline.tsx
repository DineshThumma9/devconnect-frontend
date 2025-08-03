import { Rocket, CheckCircle, Users } from "lucide-react"

interface ActivityItem {
  id: string
  title: string
  date: string
  type: "launch" | "milestone" | "meetup"
}

interface ActivityTimelineProps {
  activities: ActivityItem[]
  compact?: boolean
}



    export function ActivityTimeline({ activities}: ActivityTimelineProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case "launch":
        return <Rocket className="w-4 h-4" />
      case "milestone":
        return <CheckCircle className="w-4 h-4" />
      case "meetup":
        return <Users className="w-4 h-4" />
      default:
        return <CheckCircle className="w-4 h-4" />
    }
  }

  return (
    <div className="space-y-4">
      {activities.map((activity, index) => (
        <div key={activity.id} className="flex gap-3">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-gray-300">
              {getIcon(activity.type)}
            </div>
            {index < activities.length - 1 && <div className="w-px h-6 bg-gray-800 mt-2"></div>}
          </div>
          <div className="flex-1 pb-4">
            <h4 className="text-white font-medium text-sm">{activity.title}</h4>
            <p className="text-gray-400 text-xs mt-1">{activity.date}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
