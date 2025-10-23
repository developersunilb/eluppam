# Art of Living Form Account Setup Diagram

```mermaid
flowchart TD
    A[Primary Owner (Full Access)] -->|Owns & Manages Form| B[Form]
    C[Backup Owner (Full Access if Primary Unavailable)] -->|Backup Ownership| B
    B -->|Submissions Sent To| D[Alert Recipients (View Only)]
    E[External Collaborators (Optional, Limited Access)] -->|Edit Access| B

    style A fill:#D1E8FF,stroke:#333,stroke-width:1px
    style C fill:#FFE3B3,stroke:#333,stroke-width:1px
    style D fill:#DFFFD1,stroke:#333,stroke-width:1px
    style E fill:#F0D1FF,stroke:#333,stroke-width:1px
    style B fill:#FFFFFF,stroke:#FFF,stroke-width:1px
