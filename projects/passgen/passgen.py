#!/usr/bin/env python3
"""passgen — generate secure passwords from the terminal."""
import secrets
import string
import argparse

LOWER = string.ascii_lowercase
UPPER = string.ascii_uppercase
DIGITS = string.digits
SYMBOLS = "!@#$%&*-_=+"


def generate(length: int, symbols: bool = True) -> str:
    pool = LOWER + UPPER + DIGITS + (SYMBOLS if symbols else "")
    while True:
        pw = "".join(secrets.choice(pool) for _ in range(length))
        ok = (
            any(c in LOWER for c in pw)
            and any(c in UPPER for c in pw)
            and any(c in DIGITS for c in pw)
            and (not symbols or any(c in SYMBOLS for c in pw))
        )
        if ok:
            return pw


def strength(pw: str) -> str:
    score = sum(
        [
            len(pw) >= 12,
            len(pw) >= 16,
            any(c in LOWER for c in pw),
            any(c in UPPER for c in pw),
            any(c in DIGITS for c in pw),
            any(c in SYMBOLS for c in pw),
        ]
    )
    labels = ["Weak", "Fair", "Good", "Strong", "Very Strong", "Excellent"]
    return labels[min(score - 1, 5)]


def main() -> None:
    ap = argparse.ArgumentParser(description="Generate secure passwords.")
    ap.add_argument("length", type=int, nargs="?", default=20)
    ap.add_argument("-n", "--count", type=int, default=1)
    ap.add_argument("--no-symbols", action="store_true")
    args = ap.parse_args()

    if args.length < 8:
        print("Minimum length is 8.")
        return

    for _ in range(args.count):
        pw = generate(args.length, not args.no_symbols)
        print(f"{pw}  [{strength(pw)}]")


if __name__ == "__main__":
    main()
