---
sidebar_position: 1
slug: /collector-blueprints/transformer-boilerplate
---


# Transformer Boilerplate Generator

As of now, the Open Data Hub does not offer a wide collection of pre-configured "Transformer Blueprints" in the same way as some Data Collectors. Instead, we provide a **boilerplate generator** that sets up a minimal, ready-to-extend Go-based transformer service. This allows you to quickly get started with a functional transformer and then customize its core transformation logic to fit your specific data requirements.

This boilerplate generator is a command-line script that automates the creation of the necessary project structure, Go module setup, and initial configuration files for a new transformer.

## Location of the Boilerplate Generator

The boilerplate generator script is located within the `opendatahub-collectors` monorepo at:

[`https://github.com/noi-techpark/opendatahub-collectors/tree/main/transformers/boilerplate`](https://github.com/noi-techpark/opendatahub-collectors/tree/main/transformers/boilerplate)

## How to Use the Boilerplate Generator

To create a new transformer using the boilerplate, follow these steps:

1.  **Clone the `opendatahub-collectors` Repository**:
    If you haven't already, clone the monorepo to your local machine:
    ```bash
    git clone https://github.com/noi-techpark/opendatahub-collectors.git
    cd opendatahub-collectors
    ```

2.  **Navigate to the Boilerplate Directory**:
    Change your current directory to where the `setup_go.sh` script is located:
    ```bash
    cd transformers/boilerplate
    ```

3.  **Run the Setup Script**:
    Execute the `setup_go.sh` script. The script will prompt you for several pieces of information to customize your new transformer.

    ```bash
    ./setup_go.sh
    ```

    You will be asked for the following:

    * **Project name**: This will be the name of your transformer's root folder, used in CI/CD pipelines, and as part of its Kubernetes service name.
        * *Example*: `parking-valgardena`
    * **First part of provider tuple**: This is the first segment of the `PROVIDER` environment variable that your transformer will use. It typically identifies the data source category or the collector.
        * *Example*: `parking-offstreet`
    * **Second part of provider tuple**: This is the second segment of the `PROVIDER` environment variable, often identifying the specific data source or sub-category.
        * *Example*: `skidata`
    * **Origin**: This identifies the original source or lineage of the data. It's used in the BDP provenance.
        * *Example*: `valgardena`

    After providing the details, the script will ask for confirmation. Type `y` (or `Y`) and press Enter to proceed.

    **Example Interaction**:

    ```
    This wizard will set up the boilerplate for a new golang transformer
    Project name. This will determine root folder, cicd and k8s service e.g. 'parking-valgardena': my-new-transformer
    First part of provider tuple: my-data-source
    Second part of provider tuple: my-dataset
    Origin: my-organization
    Are you sure these are correct (y/n)? y
    ok, proceeding...
    All setup!
    ```

## Next Steps After Generation

After the boilerplate is set up, you will have a functional, albeit minimal, transformer. Your primary task will be to:

1.  **Implement Transformation Logic**: Modify the `src/main.go` and potentially `src/dto.go` files in your new transformer's directory to implement the specific data parsing, validation, and mapping logic required to convert your raw data into the Open Data Hub's BDP format.
2.  **Configure Environment Variables**: Populate the `.env.example` file with actual credentials and specific configurations for your local development. For deployment, ensure your Helm values (e.g., in `infrastructure/helm/<ORIGIN>.yaml`) are correctly configured, especially for sensitive data using Kubernetes secrets.
3.  **Test Your Transformer**: Utilize the testing patterns (e.g., `main_test.go` with `bdpmock`) to ensure your transformation logic is correct and robust.
4.  **Deploy**: Use the generated Dockerfile and Helm charts to build and deploy your transformer to your development, testing, and production environments.

This boilerplate significantly reduces the initial setup time, allowing you to focus immediately on the unique aspects of your data transformation.