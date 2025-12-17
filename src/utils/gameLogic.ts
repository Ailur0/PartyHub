import { PlayerData } from "@/components/undercover/UndercoverGame";

interface WordPair {
  civilian: string;
  spy: string;
  difficulty: "easy" | "medium" | "hard";
}

const wordPairs: WordPair[] = [
  // Easy - Very Similar Words
  { civilian: "Coffee", spy: "Tea", difficulty: "easy" },
  { civilian: "Cat", spy: "Dog", difficulty: "easy" },
  { civilian: "Ocean", spy: "Sea", difficulty: "easy" },
  { civilian: "Mountain", spy: "Hill", difficulty: "easy" },
  { civilian: "River", spy: "Lake", difficulty: "easy" },
  { civilian: "Car", spy: "Motorcycle", difficulty: "easy" },
  { civilian: "Pizza", spy: "Burger", difficulty: "easy" },
  { civilian: "Doctor", spy: "Nurse", difficulty: "easy" },
  { civilian: "Lion", spy: "Tiger", difficulty: "easy" },
  { civilian: "Rice", spy: "Pasta", difficulty: "easy" },
  { civilian: "Airplane", spy: "Helicopter", difficulty: "easy" },
  { civilian: "Guitar", spy: "Piano", difficulty: "easy" },
  { civilian: "Basketball", spy: "Football", difficulty: "easy" },
  { civilian: "Winter", spy: "Autumn", difficulty: "easy" },
  { civilian: "Book", spy: "Magazine", difficulty: "easy" },
  { civilian: "Hotel", spy: "Motel", difficulty: "easy" },
  { civilian: "Laptop", spy: "Tablet", difficulty: "easy" },
  { civilian: "Singer", spy: "Rapper", difficulty: "easy" },
  { civilian: "Shoes", spy: "Sandals", difficulty: "easy" },
  { civilian: "Juice", spy: "Smoothie", difficulty: "easy" },

  // Medium - Moderately Similar
  { civilian: "Sun", spy: "Moon", difficulty: "medium" },
  { civilian: "Bread", spy: "Cake", difficulty: "medium" },
  { civilian: "Glasses", spy: "Sunglasses", difficulty: "medium" },
  { civilian: "Movie", spy: "Series", difficulty: "medium" },
  { civilian: "Painting", spy: "Drawing", difficulty: "medium" },
  { civilian: "Chef", spy: "Waiter", difficulty: "medium" },
  { civilian: "King", spy: "Prince", difficulty: "medium" },
  { civilian: "Bank", spy: "ATM", difficulty: "medium" },
  { civilian: "Prison", spy: "Jail", difficulty: "medium" },
  { civilian: "Shopping", spy: "Window Shopping", difficulty: "medium" },
  { civilian: "Gym", spy: "Yoga Studio", difficulty: "medium" },
  { civilian: "Concert", spy: "Festival", difficulty: "medium" },
  { civilian: "Beach", spy: "Pool", difficulty: "medium" },
  { civilian: "Sunrise", spy: "Sunset", difficulty: "medium" },
  { civilian: "Zombie", spy: "Vampire", difficulty: "medium" },
  { civilian: "Robot", spy: "Cyborg", difficulty: "medium" },
  { civilian: "Spy", spy: "Detective", difficulty: "medium" },
  { civilian: "Magician", spy: "Illusionist", difficulty: "medium" },
  { civilian: "Train", spy: "Metro", difficulty: "medium" },
  { civilian: "Wedding", spy: "Engagement", difficulty: "medium" },

  // Hard - Subtly Different
  { civilian: "Boyfriend", spy: "Husband", difficulty: "hard" },
  { civilian: "Lie", spy: "Joke", difficulty: "hard" },
  { civilian: "Rich", spy: "Famous", difficulty: "hard" },
  { civilian: "Dream", spy: "Goal", difficulty: "hard" },
  { civilian: "Love", spy: "Crush", difficulty: "hard" },
  { civilian: "Lawyer", spy: "Judge", difficulty: "hard" },
  { civilian: "Password", spy: "PIN", difficulty: "hard" },
  { civilian: "Selfie", spy: "Portrait", difficulty: "hard" },
  { civilian: "Stalker", spy: "Fan", difficulty: "hard" },
  { civilian: "Bribe", spy: "Gift", difficulty: "hard" },
  { civilian: "Clone", spy: "Twin", difficulty: "hard" },
  { civilian: "Kidnap", spy: "Adopt", difficulty: "hard" },
  { civilian: "Gossip", spy: "News", difficulty: "hard" },
  { civilian: "Breakup", spy: "Divorce", difficulty: "hard" },
  { civilian: "Salary", spy: "Pocket Money", difficulty: "hard" },
  { civilian: "Homework", spy: "Assignment", difficulty: "hard" },
  { civilian: "Talent", spy: "Skill", difficulty: "hard" },
  { civilian: "Accident", spy: "Mistake", difficulty: "hard" },
  { civilian: "Memory", spy: "Flashback", difficulty: "hard" },
  { civilian: "Habit", spy: "Addiction", difficulty: "hard" },
];

export const assignWords = (
  playerNames: string[],
  difficulty: "easy" | "medium" | "hard" | "mixed" = "mixed",
  includeMrWhite: boolean = false
): PlayerData[] => {
  let availablePairs = wordPairs;
  
  if (difficulty !== "mixed") {
    availablePairs = wordPairs.filter((pair) => pair.difficulty === difficulty);
  }
  
  const wordPair = availablePairs[Math.floor(Math.random() * availablePairs.length)];
  
  // Assign roles
  const spyIndex = Math.floor(Math.random() * playerNames.length);
  let mrWhiteIndex = -1;
  
  if (includeMrWhite && playerNames.length >= 4) {
    // Make sure Mr. White is different from spy
    do {
      mrWhiteIndex = Math.floor(Math.random() * playerNames.length);
    } while (mrWhiteIndex === spyIndex);
  }

  return playerNames.map((name, index) => ({
    name,
    word: index === mrWhiteIndex ? "" : (index === spyIndex ? wordPair.spy : wordPair.civilian),
    role: index === mrWhiteIndex ? "mrwhite" : (index === spyIndex ? "spy" : "civilian"),
    isAlive: true,
  }));
};
