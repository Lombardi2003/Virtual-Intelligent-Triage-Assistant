"""Light version for the online demo: the guideline search is switched off, so no embedding model is loaded.
The specialists are told that no guideline was found and discuss the case without citing documents."""

from dataclasses import dataclass


@dataclass
class RetrievedChunk:
    """One retrieved chunk, with where it comes from (none is ever returned here)."""
    text: str
    source_file: str
    page_number: int
    score: float

    @property
    def citation(self) -> str:
        """The reference shown to the specialist: document and page."""
        return f"{self.source_file.removesuffix('.pdf')}, p. {self.page_number}"


def warm_up() -> None:
    """Nothing to load."""


def build_queries(display_name: str, symptoms: list[str], extra: str = "") -> list[str]:
    """One query per symptom, plus one for a question addressed to the specialist."""
    queries = [f"{display_name} - {s}" for s in symptoms if s.strip()] or [display_name]
    if extra.strip():
        queries.append(f"{display_name} - {extra}")
    return queries


def retrieve(queries: str | list[str], role: str | None = None, k: int = 3) -> list[RetrievedChunk]:
    """No guideline search in this version."""
    return []
