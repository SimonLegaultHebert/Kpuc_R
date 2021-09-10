attach(input[[1]])

createFile <- function(a, b, c, d){
	content <- list(a, b, c, d)
	fileName <- "results-predictions.tsv"
	write.table(content, file = gsub(" ", "", paste('./data/', fileName)), row.names=FALSE, sep="\t")
	return <- "File created"
}

createFile(chromosome, startPosition, stopPosition, type)