<script lang="ts">
    import * as vis from "vis-network/standalone";
    import {onMount} from "svelte";

    onMount(() => {
        // Define the links and nodes
        const links = [
            { from: "A", to: "B" }
        ];

        const nodes = [
            { id: "A" },
            { id: "B" }
        ];

        // Create the network
        const container = document.getElementById("network");
        const data = {
            nodes: nodes,
            edges: links
        };
        const options = {
            physics: {
                enabled: true,
                barnesHut: {
                    gravitationalConstant: -2000,
                    springConstant: 0.04,
                    springLength: 95
                },
                maxVelocity: 50,
                minVelocity: 0.1,
                solver: "barnesHut"
            },
            edges: {
                arrows: {
                    to: { enabled: true, scaleFactor: 1 }
                }
            }
        };
        const network = new vis.Network(container, data, options);
    });
</script>
<div id="network" style="width: 100%; height: 600px;"></div>
