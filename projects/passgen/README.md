# passgen

Command-line password generator. No dependencies — just Python 3.

Uses Python's `secrets` module (cryptographically secure), guarantees at least one of each character class, and rates the strength of each result.

## Usage
```bash
python passgen.py            # 20-char password
python passgen.py 32         # 32-char password
python passgen.py 16 -n 5    # 5 passwords, 16 chars each
python passgen.py --no-symbols
```
