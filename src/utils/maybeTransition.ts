export default function maybeTransition<T>(current: T, transitions: T[], chance = 0.06): T {
    if (transitions.length === 0 || Math.random() > chance) return current;
    return transitions[Math.floor(Math.random() * transitions.length)];
}