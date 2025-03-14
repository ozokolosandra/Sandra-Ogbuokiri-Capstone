export default [
    {
        "user_id": 1, // The ID of the user this report belongs to
        "report_data": {
          "mood_trends": {
            "happy": 5,
            "sad": 2,
            "stressed": 3,
            "neutral": 4
          },
          "most_common_mood": "happy",
          "insights": [
            "You were happiest on Mondays.",
            "Your mood tends to improve after exercising."
          ],
          "time_period": {
            "start_date": "2023-10-01",
            "end_date": "2023-10-31"
          }
        }
      }
]