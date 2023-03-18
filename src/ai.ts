import Layer from "./layer";

export default class AI {
    public readonly layerAmount: number = 4;
    
    // input layer: dy (to gap_y), dx (to pipe.x), v (bird current y velocity)
    // output layer: if more than 0.5, jump, if less than 0.5, don't jump

    public readonly neuronsPerIndex: number[] = [3, 5, 5, 1];
    
    private layers: Layer[] = [];

    private mutateRange: number = 50;

    public constructor() {
        for (let layer_index = 0; layer_index < this.layerAmount; layer_index++) {
            this.layers.push(new Layer(this.neuronsPerIndex[layer_index], layer_index));
        }
    }

    public setInput(dx: number, dy: number, v: number) {
        const input_layer = this.layers[0];
        
        // THIS IS IMPORTANT - DO NOT CHANGE THIS SETUP (if i save an AI, then that ai is based on THIS SPECIFIC CONFIGURATION)
        input_layer.set(0, dx);
        input_layer.set(1, dy);
        input_layer.set(2, v);
    }

    /** returns true or false to jump or not - decides by evaluating the AI */
    public decide() {
        // first step, evaluate the AI
        // forward propagation - information only propagates forward
        for (let i = 0; i < this.layerAmount; i++) {
            for (let k = 0; k < this.layers[i].neuronAmount; k++) {
                this.layers[i].neurons[k].evaluate(this.layers); // neuron needs the layer arr to find the previous layer to evaluate
            }
        }
        const output = this.layers[this.layerAmount - 1].get(0).value;
        return output > 0.5 ? true : false;
    }

    /** mate with this partner to create a new kid, with that kids brain mutated */
    public mate(partner: AI, avg_fitness: number) : AI {
        // randomly choose between weights of this parent or the other
        const kid = new AI();
        for (let layer_index = 0; layer_index < this.layerAmount; layer_index++) {
            for (let neuronIndex = 0; neuronIndex < this.neuronsPerIndex[layer_index]; neuronIndex++) {
                const parent = Math.random() > 0.5 ? this : partner;
                const curr_neuron = kid.layers[layer_index].get(neuronIndex);
                curr_neuron.weight = parent.layers[layer_index].get(neuronIndex).weight; // set the weight of this particular neuron to the chosen parent's weight
                if (this.mutateChance(avg_fitness)) {
                    // mutate that boy
                    curr_neuron.weight += 2 * Math.random() * this.mutateRange - this.mutateRange;
                }
            }
        }
        return kid;
    }

    private mutateChance(fitness: number) {
        const altered_sigmoid = (x: number) => 1 / (1 + Math.pow(Math.E, -0.01 * (x - 250)));
        return altered_sigmoid(fitness) - altered_sigmoid(0);
    }

    /** mutate the brains of this guy */
    public mutate() {
        
    }
}